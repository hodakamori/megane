# Jupyter Widget インタラクティブ化計画

## 現状の問題

現在の `widget.ts` は `MoleculeRenderer` を直接使用して分子構造のスナップショットを表示するだけで、ブラウザ版にある以下のインタラクティブ機能がすべて欠けている：

- ホバーツールチップ（原子/結合の情報表示）
- 右クリックによる原子選択 & 距離/角度/二面角の測定
- 外観パネル（原子半径、原子不透明度、結合太さ、結合不透明度のスライダー）
- トラジェクトリ再生タイムライン（再生/停止、シーク、FPS制御）
- ビューリセットボタン

## アプローチ

**widget.ts にReactを導入し、ブラウザ版と同じ `MeganeViewer` コンポーネントを再利用する。**

理由：
- React は既に `package.json` の依存関係に含まれている
- ブラウザ版の全UIコンポーネント（Viewport, Tooltip, AppearancePanel, Timeline, MeasurementPanel）をそのまま利用できる
- UIの一貫性が保たれる
- `vite.widget.config.ts` に React プラグインを追加し、`inlineDynamicImports: true` で単一ファイルにバンドルする

widget固有の不要機能（Sidebar のモード切替、ファイルアップロード、結合ソース切替など）は省略し、必要なコントロールだけを含むwidget専用のラッパーコンポーネントを作成する。

## 実装ステップ

### Step 1: ビルド設定の更新
**ファイル: `vite.widget.config.ts`**
- `@vitejs/plugin-react` プラグインを追加（JSX変換に必要）

### Step 2: Widget用ビューアーコンポーネントの作成
**ファイル: `src/components/WidgetViewer.tsx`（新規）**

ブラウザ版 `MeganeViewer` をベースに、widget用に簡略化したコンポーネントを作成：
- `Viewport` — 3Dキャンバス（そのまま再利用）
- `Tooltip` — ホバー情報（そのまま再利用）
- `MeasurementPanel` — 選択&測定（そのまま再利用）
- `AppearancePanel` — 外観コントロール（そのまま再利用）
- `Timeline` — トラジェクトリ再生（そのまま再利用）

除外するもの：
- `Sidebar` — モード切替、ファイルアップロード、結合ソース切替はwidgetでは不要（Python側で `load()` する）
- ファイルドラッグ&ドロップ

追加するもの：
- 情報バー（原子数/結合数の表示、ビューリセットボタン）

### Step 3: widget.ts の書き換え
**ファイル: `src/widget.ts`**

現在の命令型 DOM 操作から、React の `createRoot` を使って `WidgetViewer` をレンダリングするように変更：
- anywidget model から `_snapshot_data`, `_frame_data`, `frame_index`, `total_frames` を読み取り
- React state として管理し、model の変更を監視して同期
- `WidgetViewer` に props として渡す
- クリーンアップ時に `root.unmount()` を呼ぶ

### Step 4: Python側のwidgetにトラジェクトリ再生サポートを追加
**ファイル: `python/megane/widget.py`**

現状 `frame_index` の変更を Python 側で監視してフレームデータを送信する仕組みは既にある。
JS 側からの `frame_index` 変更（タイムライン操作）を受け取れるよう、`frame_index` traitlet は既に `sync=True` なので、JS→Python方向の同期も動作する。追加変更は不要の見込み。

### Step 5: ビルド & テスト
- `npm run build:widget` でビルドが通ることを確認
- Jupyter notebook での動作確認用に、widget.js が正しく生成されることを確認

## ファイル変更一覧

| ファイル | 変更内容 |
|---|---|
| `vite.widget.config.ts` | React プラグイン追加 |
| `src/components/WidgetViewer.tsx` | **新規** - Widget用簡略化ビューアー |
| `src/widget.ts` | React mount に書き換え、全機能統合 |
| `python/megane/widget.py` | 変更なし（既存のトラジェクトリ同期で十分） |

## 技術的な注意点

- anywidget の `render` 関数は `{ model, el }` を受け取り、クリーンアップ関数を返す
- widget バンドルは `inlineDynamicImports: true` で単一 ESM ファイルとして出力
- React + Three.js + WASM が全てインライン化されるためバンドルサイズは大きくなるが、anywidget の仕組み上これは許容される
- Jupyter 環境では `position: fixed` が iframe 内で動作しないケースがあるため、Tooltip は `position: absolute`（container 基準）に調整が必要な場合がある
