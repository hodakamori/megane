# megane v0.5.0 リリース前コードレビュー計画

## 目的
リリースに向けて、コードの品質・一貫性・正確性を多角的にチェックする。
各ステップで結果を記録し、最後に全体を振り返って見落としがないか再確認する。

---

## Phase 1: ビルド・環境の健全性確認

### Step 1.1 — バージョン整合性チェック
- `package.json`, `Cargo.toml`(各3クレート), `pyproject.toml` のバージョンが全て `0.5.0` で一致しているか確認
- `python/megane/__init__.py` のバージョン文字列も確認
- CHANGELOG.md に v0.5.0 のエントリが正しく記載されているか確認

### Step 1.2 — フルビルド検証
- `npm run build:wasm` → `npm run build` をフルで実行し、エラー・警告を記録
- `maturin develop --release` でPython拡張がビルドできるか確認

### Step 1.3 — 依存関係の監査
- `npm audit` でnpm依存の脆弱性チェック
- `cargo audit`(利用可能なら)でRust依存チェック
- 不要な依存・使われていない依存がないか確認(特にpuppeteerがpackage.jsonに残っている件)

---

## Phase 2: 静的解析・コード品質

### Step 2.1 — Lint & Format
- `npm run lint` — ESLint エラー/警告を全て確認
- `npm run format:check` — Prettier フォーマット違反の確認
- `cargo fmt --check` — Rustフォーマット確認
- `cargo clippy -- -D warnings` — Rust静的解析
- `ruff check python/` — Pythonリント
- `ruff format --check python/` — Pythonフォーマット

### Step 2.2 — TypeScript型安全性
- `npx tsc --noEmit` で型エラーがないか確認
- `any` 型の使用箇所をリストアップし、重大なリスクがあるか評価

### Step 2.3 — TODO/FIXME/HACK の棚卸し
- コード内の TODO/FIXME/HACK コメントを全て列挙
- リリースブロッカーとなるものがないか判定

---

## Phase 3: テスト網羅性

### Step 3.1 — 全テスト実行
- `npm test` — TypeScriptユニットテスト
- `cargo test -p megane-core` — Rustパーサーテスト
- `python -m pytest` — Pythonテスト
- E2Eテスト (`node tests/e2e/snapshot.test.mjs`)

### Step 3.2 — テストカバレッジ評価
- TypeScript: vitest --coverage の結果を確認
- Python: pytest --cov の結果を確認
- カバレッジが低いモジュールを特定し、リスク評価

### Step 3.3 — エッジケース・境界値の確認
- パーサー: 空ファイル、巨大ファイル、不正フォーマットの処理がテストされているか確認
- パイプライン: 循環グラフ、接続なしノード等の異常系テストが存在するか確認

---

## Phase 4: 公開API・エクスポートの整合性

### Step 4.1 — npm パッケージのエクスポート確認
- `package.json` の `exports` フィールドが正しいファイルを指しているか
- `dist/widget.js` と `dist/lib.js` が正しくビルドされるか
- 外部公開APIに breaking change がないか確認

### Step 4.2 — Python パッケージのエクスポート確認
- `python/megane/__init__.py` で公開されているAPI一覧を確認
- `view()`, `view_traj()` などの便利関数が正しくエクスポートされているか
- CLIエントリポイント (`megane`) が正しく設定されているか

### Step 4.3 — WASM バインディングの確認
- `crates/megane-wasm/src/lib.rs` の公開関数一覧を確認
- TypeScript側のWASMラッパーとの整合性を確認

---

## Phase 5: ドキュメント・メタデータの一貫性

### Step 5.1 — README/ドキュメント確認
- README.md のインストール手順が最新か
- サポートフォーマット一覧が実装と一致するか
- コード例のインポートパスが正しいか

### Step 5.2 — CHANGELOG 完全性
- v0.4.0〜v0.5.0 間のコミットと CHANGELOG のエントリを突き合わせ
- 記載漏れの変更がないか確認

### Step 5.3 — CI/CD パイプライン確認
- `.github/workflows/` のリリース系ワークフロー(`release.yml`, `publish-*.yml`)の設定が正しいか
- バージョン参照やトリガー条件の確認

---

## Phase 6: セキュリティ・堅牢性

### Step 6.1 — セキュリティレビュー
- FastAPI サーバー (`python/megane/server.py`) の入力バリデーション確認
- WebSocket通信のサニタイズ確認
- ファイルパス操作にパストラバーサル脆弱性がないか確認
- 環境変数やシークレットのハードコーディングがないか確認

### Step 6.2 — Rustパーサーの堅牢性
- `unwrap()` / `expect()` の使用箇所を確認し、ユーザー入力由来のデータでパニックしないか評価
- 不正入力に対する防御的プログラミングの確認

---

## Phase 7: 自己検証(振り返り)

### Step 7.1 — 結果の集約
- Phase 1〜6 で発見した全ての課題をリスト化
- 重要度(Critical / High / Medium / Low)で分類

### Step 7.2 — 再チェック
- Critical/High の課題が全て対処されたか再確認
- 見落としがないか、各Phaseの結果を改めてレビュー
- 修正によって新たな問題が発生していないか、テストを再実行して確認

### Step 7.3 — リリース判定
- 全チェック結果をまとめ、リリース可否の判定を提示
- 残存リスクがあれば明記
