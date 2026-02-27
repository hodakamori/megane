# megane

高速・シンプルな分子ビューアー。PDB構造とXTCトラジェクトリをブラウザ上でリアルタイム描画する。

- Three.js InstancedMesh + Billboard Impostor で100万原子に対応
- 5,000原子以下は高品質InstancedMesh、以上は自動でImpostorに切替
- FastAPI WebSocketでPython→ブラウザへバイナリストリーミング
- anywidget対応のJupyterウィジェット

## セットアップ

### 前提

- Python 3.10+
- [uv](https://docs.astral.sh/uv/)
- Node.js 18+

### インストール

```bash
# Python
uv sync --extra dev --extra trajectory

# Node.js
npm install
npm run build
```

## 使い方

### CLI（スタンドアロン）

```bash
uv run megane serve protein.pdb
uv run megane serve protein.pdb --xtc trajectory.xtc
uv run megane serve protein.pdb --port 9000
```

### 開発モード

```bash
# ターミナル1: Vite dev server
npm run dev

# ターミナル2: Python backend
uv run megane serve protein.pdb --dev --no-browser
```

`http://localhost:5173` でアクセス。

### Jupyter

```python
import megane

viewer = megane.MolecularViewer()
viewer.load("protein.pdb")
viewer  # セルに表示

# トラジェクトリ付き
viewer.load("protein.pdb", xtc="trajectory.xtc")
viewer.frame_index = 50
```

## テスト

```bash
uv run pytest           # Python テスト
npm run build           # TypeScript ビルド
```

## プロジェクト構造

```
src/                     TypeScript フロントエンド
  core/                  Three.js レンダラー・プロトコル・シェーダー
  components/            React UIコンポーネント
  hooks/                 カスタムReact hooks
  stream/                WebSocketクライアント
python/megane/           Python バックエンド
  parsers/               PDB / XTC パーサー
  protocol.py            バイナリプロトコル エンコーダー
  server.py              FastAPI WebSocketサーバー
  widget.py              anywidget Jupyterウィジェット
scripts/                 ベンチマーク・ヘッドレスレンダリング
tests/                   テスト
```
