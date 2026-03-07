/**
 * Selection query parser and evaluator.
 * Supports Python-like expressions for filtering atoms by properties.
 *
 * Grammar:
 *   Query      := OrExpr
 *   OrExpr     := AndExpr ("or" AndExpr)*
 *   AndExpr    := NotExpr ("and" NotExpr)*
 *   NotExpr    := "not" NotExpr | Atom
 *   Atom       := Comparison | "(" OrExpr ")" | "all" | "none"
 *   Comparison := Field Op Value
 *   Field      := "element" | "index" | "x" | "y" | "z" | "resname" | "mass"
 *   Op         := "==" | "!=" | ">" | "<" | ">=" | "<="
 *   Value      := QuotedString | Number
 */

import type { Snapshot } from "../types";
import { getElementSymbol, getAtomicMass } from "../constants";

// --- Tokenizer ---

type TokenType =
  | "field" | "op" | "number" | "string"
  | "and" | "or" | "not" | "lparen" | "rparen"
  | "all" | "none" | "eof";

interface Token {
  type: TokenType;
  value: string;
}

const FIELDS = new Set(["element", "index", "x", "y", "z", "resname", "mass"]);

function tokenize(query: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < query.length) {
    // Skip whitespace
    if (/\s/.test(query[i])) { i++; continue; }

    // Parentheses
    if (query[i] === "(") { tokens.push({ type: "lparen", value: "(" }); i++; continue; }
    if (query[i] === ")") { tokens.push({ type: "rparen", value: ")" }); i++; continue; }

    // Operators (multi-char first)
    if (query.startsWith("==", i)) { tokens.push({ type: "op", value: "==" }); i += 2; continue; }
    if (query.startsWith("!=", i)) { tokens.push({ type: "op", value: "!=" }); i += 2; continue; }
    if (query.startsWith(">=", i)) { tokens.push({ type: "op", value: ">=" }); i += 2; continue; }
    if (query.startsWith("<=", i)) { tokens.push({ type: "op", value: "<=" }); i += 2; continue; }
    if (query[i] === ">") { tokens.push({ type: "op", value: ">" }); i++; continue; }
    if (query[i] === "<") { tokens.push({ type: "op", value: "<" }); i++; continue; }

    // Quoted string
    if (query[i] === '"' || query[i] === "'") {
      const quote = query[i];
      let j = i + 1;
      while (j < query.length && query[j] !== quote) j++;
      if (j >= query.length) throw new Error(`Unterminated string at position ${i}`);
      tokens.push({ type: "string", value: query.slice(i + 1, j) });
      i = j + 1;
      continue;
    }

    // Number (including negative and decimal)
    if (/[\d.]/.test(query[i]) || (query[i] === "-" && i + 1 < query.length && /[\d.]/.test(query[i + 1]))) {
      let j = i;
      if (query[j] === "-") j++;
      while (j < query.length && /[\d.]/.test(query[j])) j++;
      tokens.push({ type: "number", value: query.slice(i, j) });
      i = j;
      continue;
    }

    // Keywords and field names
    if (/[a-zA-Z_]/.test(query[i])) {
      let j = i;
      while (j < query.length && /[a-zA-Z_0-9]/.test(query[j])) j++;
      const word = query.slice(i, j);
      if (word === "and") tokens.push({ type: "and", value: word });
      else if (word === "or") tokens.push({ type: "or", value: word });
      else if (word === "not") tokens.push({ type: "not", value: word });
      else if (word === "all") tokens.push({ type: "all", value: word });
      else if (word === "none") tokens.push({ type: "none", value: word });
      else if (FIELDS.has(word)) tokens.push({ type: "field", value: word });
      else throw new Error(`Unknown identifier: "${word}"`);
      i = j;
      continue;
    }

    throw new Error(`Unexpected character: "${query[i]}" at position ${i}`);
  }
  tokens.push({ type: "eof", value: "" });
  return tokens;
}

// --- AST ---

type ASTNode =
  | { kind: "comparison"; field: string; op: string; value: string | number }
  | { kind: "and"; left: ASTNode; right: ASTNode }
  | { kind: "or"; left: ASTNode; right: ASTNode }
  | { kind: "not"; operand: ASTNode }
  | { kind: "all" }
  | { kind: "none" };

// --- Parser ---

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private advance(): Token {
    return this.tokens[this.pos++];
  }

  private expect(type: TokenType): Token {
    const t = this.peek();
    if (t.type !== type) {
      throw new Error(`Expected ${type}, got ${t.type} ("${t.value}")`);
    }
    return this.advance();
  }

  parse(): ASTNode {
    const node = this.parseOr();
    if (this.peek().type !== "eof") {
      throw new Error(`Unexpected token: "${this.peek().value}"`);
    }
    return node;
  }

  private parseOr(): ASTNode {
    let left = this.parseAnd();
    while (this.peek().type === "or") {
      this.advance();
      const right = this.parseAnd();
      left = { kind: "or", left, right };
    }
    return left;
  }

  private parseAnd(): ASTNode {
    let left = this.parseNot();
    while (this.peek().type === "and") {
      this.advance();
      const right = this.parseNot();
      left = { kind: "and", left, right };
    }
    return left;
  }

  private parseNot(): ASTNode {
    if (this.peek().type === "not") {
      this.advance();
      const operand = this.parseNot();
      return { kind: "not", operand };
    }
    return this.parseAtom();
  }

  private parseAtom(): ASTNode {
    const t = this.peek();

    if (t.type === "all") {
      this.advance();
      return { kind: "all" };
    }

    if (t.type === "none") {
      this.advance();
      return { kind: "none" };
    }

    if (t.type === "lparen") {
      this.advance();
      const node = this.parseOr();
      this.expect("rparen");
      return node;
    }

    if (t.type === "field") {
      const field = this.advance().value;
      const op = this.expect("op").value;
      const valToken = this.peek();
      let value: string | number;
      if (valToken.type === "string") {
        value = this.advance().value;
      } else if (valToken.type === "number") {
        value = parseFloat(this.advance().value);
        if (isNaN(value)) throw new Error(`Invalid number`);
      } else {
        throw new Error(`Expected value after operator, got ${valToken.type}`);
      }
      return { kind: "comparison", field, op, value };
    }

    throw new Error(`Unexpected token: "${t.value}" (${t.type})`);
  }
}

// --- Evaluator ---

/** Extract residue name from atom label (e.g., "ALA42" → "ALA"). */
function parseResname(label: string): string {
  const match = label.match(/^([A-Za-z]+)/);
  return match ? match[1] : label;
}

function compileAST(
  ast: ASTNode,
  snapshot: Snapshot,
  atomLabels: string[] | null,
): (index: number) => boolean {
  switch (ast.kind) {
    case "all":
      return () => true;
    case "none":
      return () => false;
    case "not": {
      const fn = compileAST(ast.operand, snapshot, atomLabels);
      return (i) => !fn(i);
    }
    case "and": {
      const left = compileAST(ast.left, snapshot, atomLabels);
      const right = compileAST(ast.right, snapshot, atomLabels);
      return (i) => left(i) && right(i);
    }
    case "or": {
      const left = compileAST(ast.left, snapshot, atomLabels);
      const right = compileAST(ast.right, snapshot, atomLabels);
      return (i) => left(i) || right(i);
    }
    case "comparison": {
      const { field, op, value } = ast;
      return (i) => {
        let fieldValue: string | number;
        switch (field) {
          case "element":
            fieldValue = getElementSymbol(snapshot.elements[i]);
            break;
          case "index":
            fieldValue = i;
            break;
          case "x":
            fieldValue = snapshot.positions[i * 3];
            break;
          case "y":
            fieldValue = snapshot.positions[i * 3 + 1];
            break;
          case "z":
            fieldValue = snapshot.positions[i * 3 + 2];
            break;
          case "resname":
            fieldValue = atomLabels?.[i] ? parseResname(atomLabels[i]) : "";
            break;
          case "mass":
            fieldValue = getAtomicMass(snapshot.elements[i]);
            break;
          default:
            return false;
        }

        switch (op) {
          case "==": return fieldValue === value;
          case "!=": return fieldValue !== value;
          case ">":  return fieldValue > value;
          case "<":  return fieldValue < value;
          case ">=": return fieldValue >= value;
          case "<=": return fieldValue <= value;
          default: return false;
        }
      };
    }
  }
}

/**
 * Evaluate a selection query against a snapshot.
 * Returns null for empty query or "all" (meaning all atoms selected).
 * Returns a Set of matching atom indices otherwise.
 */
export function evaluateSelection(
  query: string,
  snapshot: Snapshot,
  atomLabels: string[] | null,
): Set<number> | null {
  const trimmed = query.trim();
  if (trimmed === "" || trimmed === "all") return null;

  const tokens = tokenize(trimmed);
  const parser = new Parser(tokens);
  const ast = parser.parse();

  if (ast.kind === "all") return null;
  if (ast.kind === "none") return new Set();

  const predicate = compileAST(ast, snapshot, atomLabels);
  const result = new Set<number>();
  for (let i = 0; i < snapshot.nAtoms; i++) {
    if (predicate(i)) result.add(i);
  }
  return result;
}

/**
 * Validate a query string without evaluating it.
 * Returns { valid: true } or { valid: false, error: "..." }.
 */
export function validateQuery(query: string): { valid: boolean; error?: string } {
  const trimmed = query.trim();
  if (trimmed === "" || trimmed === "all" || trimmed === "none") {
    return { valid: true };
  }
  try {
    const tokens = tokenize(trimmed);
    const parser = new Parser(tokens);
    parser.parse();
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}
