/**
 * Stub module used by node component tests in place of `@xyflow/react`.
 * The real package needs a `<ReactFlowProvider>` wrapper for `<Handle>` to
 * resolve its internal store, which is overkill for unit tests that only
 * care about handle props. The stubs below cover everything imported at
 * runtime by `src/pipeline/store.ts`, `src/components/nodes/NodeShell.tsx`,
 * and `src/pipeline/serialize.ts`.
 *
 * Wire it up per test file with:
 *   vi.mock("@xyflow/react", () => import("./_xyflowMock"));
 */

export const Handle = (props: {
  id?: string;
  type?: string;
  position?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  const { id, type, position, style, children } = props;
  return (
    <div
      data-testid={`handle-${type}-${id}`}
      data-handleid={id}
      data-handletype={type}
      data-handleposition={position}
      style={style}
    >
      {children}
    </div>
  );
};

export const Position = {
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right",
} as const;

export function applyNodeChanges<T>(_changes: unknown, nodes: T): T {
  return nodes;
}

export function applyEdgeChanges<T>(_changes: unknown, edges: T): T {
  return edges;
}

export function addEdge<T>(edge: T, edges: T[]): T[] {
  return [...edges, edge];
}
