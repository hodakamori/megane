# Contributing to megane

Thank you for your interest in contributing to megane. This document covers the development setup, testing, and submission process.

## Development Setup

Prerequisites: Node.js 22+, Rust (stable), Python 3.11+, [uv](https://github.com/astral-sh/uv).

```bash
# Install dependencies
npm install
cargo install wasm-pack       # if not already installed
npm run build:wasm             # MUST run before the dev server
uv sync --extra dev            # Python dependencies

# Build the Python extension (editable)
maturin develop --release
```

After setup, you can start the dev server with `npm run dev`.

## Running Tests

| Command | Scope |
|---|---|
| `npm test` | TypeScript unit tests (vitest) |
| `cargo test -p megane-core` | Rust parser tests |
| `python -m pytest` | Python tests (requires `maturin develop` first) |
| `make test-all` | All of the above combined |

Please run `make test-all` before submitting a pull request.

## Code Style

- **TypeScript** -- Strict mode enabled. Use the `@/` import alias for paths under `src/`.
- **Rust** -- Stable toolchain. Run `cargo fmt` and `cargo clippy` before committing.
- **Python** -- Target Python 3.10+. Follow PEP 8 conventions.

Commit messages must be written in English.

## Submitting a Pull Request

1. Fork the repository and create a feature branch from `main`.
2. Make your changes, keeping commits focused and well-described.
3. Run `make test-all` and confirm all tests pass.
4. Open a pull request against `main` and fill out the PR template.
5. A maintainer will review your PR. Please address any feedback promptly.

## Reporting Issues

Use the GitHub issue templates for bug reports and feature requests. Include as much detail as possible, especially the file format you were viewing and steps to reproduce the problem.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
