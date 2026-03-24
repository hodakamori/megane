"""Generate Python API reference markdown from source docstrings.

Uses the ast module to statically parse Python source files without importing them,
avoiding the need to build the Rust extension (megane_parser) in CI.
"""

from __future__ import annotations

import ast
import re
import textwrap
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
PYTHON_SRC = ROOT / "python" / "megane"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "docs" / "api" / "python"

# Files to extract API documentation from
SOURCES = [
    PYTHON_SRC / "__init__.py",
    PYTHON_SRC / "widget.py",
    PYTHON_SRC / "parsers" / "pdb.py",
    PYTHON_SRC / "parsers" / "xtc.py",
]


@dataclass
class FuncInfo:
    name: str
    args: str
    returns: str
    docstring: str
    decorators: list[str]


@dataclass
class ClassInfo:
    name: str
    bases: list[str]
    docstring: str
    methods: list[FuncInfo]
    attributes: list[tuple[str, str, str]]  # (name, annotation, comment)


@dataclass
class DataclassInfo:
    name: str
    docstring: str
    fields: list[tuple[str, str, str]]  # (name, type, comment)
    methods: list[FuncInfo]


def _get_docstring(node: ast.AST) -> str:
    """Extract docstring from an AST node."""
    return ast.get_docstring(node) or ""


def _format_arg(arg: ast.arg) -> str:
    """Format a function argument with optional type annotation."""
    name = arg.arg
    if arg.annotation:
        return f"{name}: {ast.unparse(arg.annotation)}"
    return name


def _parse_function(node: ast.FunctionDef | ast.AsyncFunctionDef) -> FuncInfo:
    """Parse a function/method definition."""
    args_parts = []

    # Regular args
    defaults_offset = len(node.args.args) - len(node.args.defaults)
    for i, arg in enumerate(node.args.args):
        if arg.arg == "self":
            continue
        formatted = _format_arg(arg)
        default_idx = i - defaults_offset
        if default_idx >= 0 and default_idx < len(node.args.defaults):
            default = ast.unparse(node.args.defaults[default_idx])
            formatted += f" = {default}"
        args_parts.append(formatted)

    # *args
    if node.args.vararg:
        args_parts.append(f"*{_format_arg(node.args.vararg)}")

    # **kwargs
    if node.args.kwarg:
        args_parts.append(f"**{_format_arg(node.args.kwarg)}")

    returns = ""
    if node.returns:
        returns = ast.unparse(node.returns)

    decorators = [ast.unparse(d) for d in node.decorator_list]

    return FuncInfo(
        name=node.name,
        args=", ".join(args_parts),
        returns=returns,
        docstring=_get_docstring(node),
        decorators=decorators,
    )


def _extract_inline_comment(source_lines: list[str], lineno: int) -> str:
    """Extract inline comment from a source line (1-indexed lineno)."""
    if lineno <= 0 or lineno > len(source_lines):
        return ""
    line = source_lines[lineno - 1]
    # Find comment after code
    idx = line.find("#")
    if idx >= 0:
        return line[idx + 1:].strip()
    return ""


def _parse_class(
    node: ast.ClassDef, source_lines: list[str] | None = None
) -> ClassInfo | DataclassInfo:
    """Parse a class definition."""
    bases = [ast.unparse(b) for b in node.bases]
    docstring = _get_docstring(node)
    methods: list[FuncInfo] = []
    fields: list[tuple[str, str, str]] = []

    is_dataclass = any(
        (isinstance(d, ast.Name) and d.id == "dataclass")
        or (isinstance(d, ast.Attribute) and d.attr == "dataclass")
        for d in node.decorator_list
    )

    for item in ast.iter_child_nodes(node):
        if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
            if not item.name.startswith("_") or item.name == "__init__":
                methods.append(_parse_function(item))
        elif isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name):
            field_name = item.target.id
            field_type = ast.unparse(item.annotation) if item.annotation else ""
            comment = ""
            # Extract inline comment from source line
            if source_lines and hasattr(item, "lineno"):
                comment = _extract_inline_comment(source_lines, item.lineno)
            fields.append((field_name, field_type, comment))

    if is_dataclass:
        return DataclassInfo(
            name=node.name,
            docstring=docstring,
            fields=fields,
            methods=[m for m in methods if m.name != "__init__"],
        )

    return ClassInfo(
        name=node.name,
        bases=bases,
        docstring=docstring,
        methods=methods,
        attributes=fields,
    )


def _escape_mdx_braces(text: str) -> str:
    """Escape { and } in text so MDX does not treat them as JSX expressions.

    Preserves braces inside backtick-delimited inline code spans.
    """
    parts = re.split(r"(`[^`]*`)", text)
    for i, part in enumerate(parts):
        if not part.startswith("`"):
            parts[i] = part.replace("{", "\\{").replace("}", "\\}")
    return "".join(parts)


def _format_docstring(docstring: str) -> str:
    """Format a docstring for markdown output."""
    if not docstring:
        return ""
    text = textwrap.dedent(docstring).strip()
    return _escape_mdx_braces(text)


def _func_to_markdown(func: FuncInfo, heading_level: int = 3) -> str:
    """Convert a FuncInfo to markdown."""
    lines = []
    prefix = "#" * heading_level

    # Signature
    sig = f"{func.name}({func.args})"
    if func.returns:
        sig += f" → {func.returns}"

    lines.append(f"{prefix} `{func.name}`")
    lines.append("")
    lines.append("```python")
    if func.returns:
        lines.append(f"def {func.name}({func.args}) -> {func.returns}")
    else:
        lines.append(f"def {func.name}({func.args})")
    lines.append("```")
    lines.append("")

    if func.docstring:
        lines.append(_format_docstring(func.docstring))
        lines.append("")

    return "\n".join(lines)


def generate_python_api() -> str:
    """Generate the full Python API reference markdown."""
    lines = [
        "---",
        "# This file is auto-generated. Do not edit manually.",
        "---",
        "",
        "# Python API Reference",
        "",
    ]

    all_classes: list[ClassInfo | DataclassInfo] = []
    all_functions: list[FuncInfo] = []
    module_docstring = ""

    for source_file in SOURCES:
        if not source_file.exists():
            continue

        source_text = source_file.read_text()
        source_lines = source_text.splitlines()
        tree = ast.parse(source_text)

        # Get module docstring from __init__.py
        if source_file.name == "__init__.py":
            module_docstring = _get_docstring(tree)

        for node in ast.iter_child_nodes(tree):
            if isinstance(node, ast.ClassDef):
                if not node.name.startswith("_"):
                    all_classes.append(_parse_class(node, source_lines))
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                if not node.name.startswith("_"):
                    all_functions.append(_parse_function(node))

    if module_docstring:
        lines.append(_escape_mdx_braces(module_docstring))
        lines.append("")

    lines.append("## Installation")
    lines.append("")
    lines.append("```bash")
    lines.append("pip install megane")
    lines.append("```")
    lines.append("")
    lines.append("```python")
    lines.append("import megane")
    lines.append("```")
    lines.append("")

    # Classes
    for cls in all_classes:
        if isinstance(cls, DataclassInfo):
            lines.append(f"## `{cls.name}`")
            lines.append("")
            if cls.docstring:
                lines.append(_format_docstring(cls.docstring))
                lines.append("")

            public_fields = [(n, t, c) for n, t, c in cls.fields if not n.startswith("_")]
            if public_fields:
                lines.append("**Fields:**")
                lines.append("")
                lines.append("| Field | Type | Description |")
                lines.append("|-------|------|-------------|")
                for name, type_str, comment in public_fields:
                    type_display = f"`{type_str}`" if type_str else ""
                    desc = comment if comment else ""
                    lines.append(f"| `{name}` | {type_display} | {desc} |")
                lines.append("")

            for method in cls.methods:
                lines.append(_func_to_markdown(method, heading_level=3))

        elif isinstance(cls, ClassInfo):
            bases_str = f"({', '.join(cls.bases)})" if cls.bases else ""
            lines.append(f"## `{cls.name}`")
            lines.append("")
            if cls.bases:
                lines.append(f"Inherits from: `{', '.join(cls.bases)}`")
                lines.append("")
            if cls.docstring:
                lines.append(_format_docstring(cls.docstring))
                lines.append("")

            if cls.attributes:
                lines.append("**Attributes:**")
                lines.append("")
                lines.append("| Attribute | Type | Description |")
                lines.append("|-----------|------|-------------|")
                for name, type_str, comment in cls.attributes:
                    if name.startswith("_"):
                        continue
                    type_display = f"`{type_str}`" if type_str else ""
                    lines.append(f"| `{name}` | {type_display} | {comment} |")
                lines.append("")

            for method in cls.methods:
                lines.append(_func_to_markdown(method, heading_level=3))

    # Module-level functions
    if all_functions:
        lines.append("## Functions")
        lines.append("")
        for func in all_functions:
            lines.append(_func_to_markdown(func, heading_level=3))

    return "\n".join(lines)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Generate main API reference
    content = generate_python_api()
    output_file = OUTPUT_DIR / "index.md"
    output_file.write_text(content)
    print(f"Generated {output_file}")


if __name__ == "__main__":
    main()
