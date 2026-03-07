# パイプラインノード接続の改善設計

## 現状の問題点

1. **任意のノード同士が接続可能** — `selection` → `set_bond` のような意味のない接続もできてしまう（`set_bond` はselectionコンテキストを無視する）
2. **入出力の意味が不明確** — すべてのハンドルが同じ青色の丸で、何が流れているかわからない
3. **接続ルールが暗黙的** — `load_structure` に入力を繋ごうとしても見た目で判断できない

## 分析：ノードの入出力の性質

現在の実行エンジン（`execute.ts`）を分析すると、ノード間を流れるデータは以下の2種類：

| データフロー | 説明 | 利用するノード |
|---|---|---|
| **Pipeline（構造＋描画状態）** | 分子構造データと累積されたRenderState | 全ノード |
| **Selection（原子選択コンテキスト）** | 選択された原子のインデックス集合 | `selection`（生成）、`set_atom`（消費して per-atom override に使用）|

**重要な発見**: `selection` ノードの出力を実際に利用できるのは `selection`（連鎖フィルタ）と `set_atom`（per-atom override）だけ。`set_bond`, `set_labels`, `set_vectors`, `set_display`, `set_cell_visibility` は selection コンテキストを完全に無視する。

## 接続ルール定義

### ノード分類

```
Source（ソース）:     load_structure
Filter（フィルタ）:   selection
Atom Modifier:        set_atom
Global Modifier:      set_bond_source, set_bond, set_labels, set_vectors, set_display, set_cell_visibility
```

### 有効な接続マトリクス

| 出力元 ↓ ＼ 入力先 → | selection | set_atom | Global Modifier |
|---|---|---|---|
| **load_structure** | OK | OK | OK |
| **selection** | OK | OK | NG（意味がない）|
| **set_atom** | OK | OK | OK |
| **Global Modifier** | OK | OK | OK |

まとめると：
- `load_structure` は入力ハンドルなし（ソースノード）
- `selection` の出力先は `selection` と `set_atom` のみ
- その他のノードはすべて相互に接続可能

## 実装設計

### 1. 接続ルールの定義（`types.ts` に追加）

```typescript
/**
 * ノードカテゴリ: 接続バリデーションに使用
 */
export type NodeCategory = "source" | "filter" | "atom_modifier" | "global_modifier";

export const NODE_CATEGORIES: Record<PipelineNodeType, NodeCategory> = {
  load_structure: "source",
  selection: "filter",
  set_atom: "atom_modifier",
  set_bond_source: "global_modifier",
  set_bond: "global_modifier",
  set_labels: "global_modifier",
  set_vectors: "global_modifier",
  set_display: "global_modifier",
  set_cell_visibility: "global_modifier",
};

/**
 * selection ノードからの接続先として有効なノードタイプ
 */
export const SELECTION_VALID_TARGETS: Set<PipelineNodeType> = new Set([
  "selection",
  "set_atom",
]);

/**
 * 2つのノードタイプ間で接続が有効かを判定
 */
export function canConnect(sourceType: PipelineNodeType, targetType: PipelineNodeType): boolean {
  // load_structure は入力を受け付けない
  if (targetType === "load_structure") return false;
  // selection の出力先は selection と set_atom のみ
  if (sourceType === "selection") return SELECTION_VALID_TARGETS.has(targetType);
  return true;
}
```

### 2. ハンドルの色分け（`NodeShell.tsx` を修正）

ハンドルの色でデータフローの種類を視覚的に示す：

| ハンドル | 色 | 意味 |
|---|---|---|
| 通常の入力/出力 | 青 `#3b82f6` | Pipeline データフロー |
| `selection` の出力 | オレンジ `#f59e0b` | Selection コンテキスト付き |
| `selection`, `set_atom` の入力 | オレンジ `#f59e0b` | Selection を受け付ける |

`NodeShell` にハンドル色を props で渡せるようにする：

```typescript
interface NodeShellProps {
  id: string;
  nodeType: PipelineNodeType;
  enabled: boolean;
  hasInput?: boolean;
  hasOutput?: boolean;
  children: React.ReactNode;
}

// ノードタイプからハンドル色を決定
function getHandleColors(nodeType: PipelineNodeType): { input: string; output: string } {
  const blue = "#3b82f6";
  const orange = "#f59e0b";

  switch (nodeType) {
    case "load_structure":
      return { input: blue, output: blue };
    case "selection":
      return { input: orange, output: orange };
    case "set_atom":
      return { input: orange, output: blue };
    default:
      return { input: blue, output: blue };
  }
}
```

### 3. 接続バリデーション（`PipelineEditor.tsx` + `store.ts` を修正）

ReactFlow の `isValidConnection` コールバックで無効な接続をブロック：

```typescript
// PipelineEditor.tsx
const isValidConnection = useCallback(
  (connection: Connection) => {
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (!sourceNode || !targetNode) return false;
    // 自己接続を防止
    if (connection.source === connection.target) return false;
    return canConnect(
      sourceNode.type as PipelineNodeType,
      targetNode.type as PipelineNodeType,
    );
  },
  [nodes],
);

// ReactFlow に渡す
<ReactFlow
  ...
  isValidConnection={isValidConnection}
/>
```

### 4. ドラッグ中の視覚フィードバック（`PipelineEditor.tsx` に追加）

ユーザーがハンドルからドラッグを開始したとき、接続可能なノードをハイライトし、不可能なノードを薄くする。

ReactFlow の `onConnectStart` / `onConnectEnd` を使用：

```typescript
const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

const onConnectStart = useCallback(
  (_: React.MouseEvent, params: { nodeId: string | null }) => {
    setConnectingFrom(params.nodeId);
  },
  [],
);

const onConnectEnd = useCallback(() => {
  setConnectingFrom(null);
}, []);
```

`connectingFrom` がセットされている間、各ノードに `className` を動的に付与して、
接続不可のノードを CSS で `opacity: 0.3` にする。

### 5. エッジのスタイル改善（`PipelineEditor.tsx` を修正）

接続のタイプに応じてエッジの色も変える：

```typescript
// selection 関連のエッジはオレンジ色にする
const styledEdges = useMemo(() => {
  return edges.map((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const isSelectionEdge = sourceNode?.type === "selection";
    return {
      ...edge,
      style: {
        stroke: isSelectionEdge ? "#f59e0b" : "#94a3b8",
        strokeWidth: 2,
      },
    };
  });
}, [edges, nodes]);
```

### 6. ハンドルツールチップ（`NodeShell.tsx` に追加）

ハンドルにホバーしたとき、そのポートの意味を表示：

```typescript
const HANDLE_TOOLTIPS: Record<PipelineNodeType, { input?: string; output: string }> = {
  load_structure: { output: "Structure data" },
  selection: { input: "Pipeline / Selection", output: "Filtered selection" },
  set_atom: { input: "Pipeline / Selection", output: "Pipeline" },
  set_bond_source: { input: "Pipeline", output: "Pipeline" },
  set_bond: { input: "Pipeline", output: "Pipeline" },
  set_labels: { input: "Pipeline", output: "Pipeline" },
  set_vectors: { input: "Pipeline", output: "Pipeline" },
  set_display: { input: "Pipeline", output: "Pipeline" },
  set_cell_visibility: { input: "Pipeline", output: "Pipeline" },
};
```

ハンドルを `<div title="...">` でラップ。

## 変更ファイル一覧

| ファイル | 変更内容 |
|---|---|
| `src/pipeline/types.ts` | `NodeCategory`, `canConnect()`, `SELECTION_VALID_TARGETS` 追加 |
| `src/components/nodes/NodeShell.tsx` | ハンドル色分け、ツールチップ追加 |
| `src/components/PipelineEditor.tsx` | `isValidConnection`, ドラッグ中フィードバック、エッジ色分け |
| `src/pipeline/store.ts` | `onConnect` でバリデーション追加（二重チェック）|

## 将来の拡張

- 複数ポート対応（例: `set_atom` に "selection" 入力と "pipeline" 入力を別ポートにする）
- ノードのプレビュー（各ノードの出力時点での選択原子数を表示）
- "Add Node" メニューでカテゴリ別グループ化
