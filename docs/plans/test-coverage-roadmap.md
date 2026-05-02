# Test Coverage Roadmap (Refactoring Re-plan)

## Progress (updated)

- ✅ Phase 0 — codecov flag/upload alignment (option A): commit `c17462a`
- ✅ Phase 1 — `src/tour/` unit tests (3 files, 277 LOC): commit `b03bf04`
- ✅ Phase 2 — `src/stream/` unit tests (2 files, 361 LOC): commit `61ada6e`
- ✅ Phase 3 — `src/ai/` unit tests (4 files, 539 LOC) + `parseFrontmatter` export: commit `db0b679`
- ⬜ Phase 4 — `src/renderer/` pure helpers (Selection, Picking, CameraManager, shaders)
- ⬜ Phase 5 — `src/components/nodes/` UI tests (split: NodeShell + 4, then remaining 8)
- ⬜ Phase 6 — `jupyterlab-megane/src/` (filetypes, wasmLoader, factory)
- ⬜ Phase 7 — `vscode-megane/src/extension.ts` with vscode mock
- ⬜ Phase 8 — codecov threshold tightening (`1% → 2%`) + `fail_ci_on_error: true`

Total new tests added in Phases 0–3: **100** tests across 9 files (1,177 LOC test source).

## Context

main を取り込んだ直後のリポジトリでは、すでに以下が main 側で完了しています:

- `codecov.yml` 新設 (Python / TypeScript / Rust / VSCode / JupyterLab フラグ宣言)
- TS coverage の CI 投入 (`vitest run --coverage` → lcov を codecov へ)
- Rust coverage の CI 投入 (`cargo-llvm-cov` → lcov)
- `vitest.config.ts` の include 拡張 (`vscode-megane/src/`, `jupyterlab-megane/src/` を coverage 対象化)
- `MeganeViewer.tsx` のリファクタ (`useAtomSelection` / `useNodeLoadHandlers` 抽出、326 行に縮小)
- `src/pipeline/storeSnapshot.ts` 新設、`serialize.ts` 拡充

そのうえで、**現状 codecov に上がる数値の質を最も毀損しているのはテスト未整備領域** です。`vitest.config.ts:20-21` で coverage 対象に入っている `vscode-megane/src/` と `jupyterlab-megane/src/` は **テストインポートが 0 件**、`src/renderer/`, `src/ai/`, `src/stream/`, `src/tour/`, `src/components/nodes/` も **unit test がゼロ**。さらに `ci.yml` の TS upload は `flags: typescript,vscode,jupyterlab` の 3 フラグ兼用 1 アップロードで、codecov.yml の per-flag status が機能しない構造。

このロードマップは **「未整備領域への unit test 追加」を中心に、複数 PR に分けて段階的に進める** ためのもの。各フェーズは独立 PR にでき、CI のグリーンを保ったまま進められる粒度に切る。

## ガードレール

- **CRITICAL RULES 遵守**: 英語コミット / Playwright のみ / `npm run build:wasm` 先行 / push 後 `gh pr create` & `gh run list` / plan 厳守
- **既存ファイルへの侵襲を最小化**: 各フェーズは "テスト追加 + 必要最小の export 追加" まで。実装ロジックの構造変更は別途タスク化。
- **Three.js / WebGL ハードな経路は jsdom では不可**: `MoleculeRenderer.ts` 本体や mesh 生成の WebGL コール経路は E2E に任せ、**純粋ロジック (math / state / parsers)** に絞って単体テストを書く。
- **既存パターンに乗る**: `tests/ts/setup.ts` (`@testing-library/jest-dom/vitest`)、`tests/ts/stores/usePlaybackStore.test.ts`、`tests/ts/components/*.test.tsx` を参照テンプレに。
- **vitest 設定はそのまま**: `vitest.config.ts:12` の `include: ["tests/ts/**/*.test.{ts,tsx}"]` に従い、新規テストは `tests/ts/<area>/` に追加。

## Phase 0 — codecov 信号の整合性修正 (前提・ブロッキング) ✅ DONE (`c17462a`)

**実施内容**: 推奨案 A (フラグ統合) を採用。`codecov.yml` から `vscode` / `jupyterlab` の status と `individual_flags` エントリを削除し、`typescript` フラグの paths に `vscode-megane/src/` と `jupyterlab-megane/src/` を追加。`.github/workflows/ci.yml:79` の `flags: typescript,vscode,jupyterlab` を `flags: typescript` に縮約。`fail_ci_on_error: true` への昇格は Phase 8 に持ち越し。



このフェーズなしに以降のテストを足してもフラグ別ステータスが正しく光らない。

- **問題**: `.github/workflows/ci.yml` の TS upload は `flags: typescript,vscode,jupyterlab` の 1 件統合。`codecov.yml:22-31` は `vscode` / `jupyterlab` を独立フラグとして扱う前提で、`flag_management.individual_flags` の `paths` も別建て (`vscode-megane/src/`, `jupyterlab-megane/src/`)。
- **対応案 (推奨)**: codecov.yml を **2 構成のいずれかに揃える**。
  - (A) **フラグ統合**: `vscode` / `jupyterlab` の status / individual_flags を削除し `typescript` フラグの paths に `vscode-megane/src/`, `jupyterlab-megane/src/` を含める。upload 1 回構成のまま機能する。
  - (B) **アップロード分割**: `npm test -- --coverage` 後に lcov を 3 ファイルに切り出し、codecov-action を 3 回呼ぶ。`@vitest/coverage-v8` は単一 lcov を出すため、`lcov` 用の path フィルタ (例: `lcov-result-merger` か手書き sed) が必要で複雑。
- **追加修正**:
  - main / リリースブランチでは `fail_ci_on_error: true` に上げる (現在は 3 ステップとも `false`)。
  - `codecov.yml:6,9,...` の `threshold: 1%` は緩いので、後続フェーズでカバレッジが上がってきたら `2%` に引き締める (Phase 8 で実施)。
- **対象ファイル**: `.github/workflows/ci.yml`, `codecov.yml`
- **検証**: PR で codecov コメントを確認し、`typescript` (または `typescript` / `vscode` / `jupyterlab`) ステータスが PR チェックに分離して現れること。

## Phase 1 — `src/tour/` (小さく・純粋・即効性高) ✅ DONE (`b03bf04`)

**実施内容**: 以下 3 ファイル / 35 テストを追加。`MeganeTour.ts` 本体は driver.js DOM 結合のため `useTour` 経由で間接的にカバー。

- `tests/ts/tour/tourStore.test.ts` (131 LOC, 20 tests): `setHost` / `setActive` / `markAutoStartHandled` / `setDontShowAgain` (localStorage 永続化 + 不正 JSON 耐性 + 再 import パス) と `shouldAutoStart` の 4 ホスト × `dontShowAgain` 行列、`?guide=on/off/1/0/true/false` URL オーバーライド
- `tests/ts/tour/tourSteps.test.ts` (62 LOC, 8 tests): ステップ数 / Welcome 構造 / `package.json` 由来バージョン / 全ステップタイトル非空 / アンカーセレクタ非空・重複なし
- `tests/ts/tour/useTour.test.tsx` (84 LOC, 7 tests): `vi.mock("@/tour/MeganeTour")` で driver.js を回避、`renderHook` で host 同期 / 自動開始ゲート / unmount での `stopTour` / 手動 `startTour` 経路を検証



`useTour.ts` (52), `tourStore.ts` (98), `tourSteps.ts` (179), `MeganeTour.ts` (80)。zustand ベース + 純データのみ。

- **追加テスト**:
  - `tests/ts/tour/tourStore.test.ts`: ステップ進行 / クローズ / プログレス計算 (`tests/ts/stores/usePlaybackStore.test.ts` と同パターン)
  - `tests/ts/tour/tourSteps.test.ts`: ステップ配列の妥当性 (重複 id 無し、ターゲット selector が空文字でない、等)
  - `tests/ts/tour/useTour.test.tsx`: `@testing-library/react` の `renderHook` で開閉状態を検証
- **対象ファイル**: `tests/ts/tour/*.test.{ts,tsx}` を新規追加
- **既存利用**: `@testing-library/react` は既に `tests/ts/components/*` で使用中
- **規模**: S

## Phase 2 — `src/stream/` (WebSocket / フレーム供給) ✅ DONE (`61ada6e`)

**実施内容**: 以下 2 ファイル / 23 テストを追加。`globalThis.WebSocket` を `MockWebSocket` クラスでスタブ化するパターンを `tests/ts/` に新規導入。

- `tests/ts/stream/WebSocketClient.test.ts` (243 LOC, 15 tests): connect / 自動再接続の指数バックオフ (1s→2s→4s→8s→16s→30s 上限) / 成功 open でのバックオフリセット / disconnect での timer キャンセル / `send()` の readyState ガード / `connected` getter / `onerror` 非例外
- `tests/ts/stream/StreamFrameProvider.test.ts` (118 LOC, 8 tests): cache miss → `request_frame` 送信 / `receiveFrame` の `onFrameReady` 発火 / `maxCacheSize` 越えでの LRU 退避 / 既存 frameId 再 receive での MRU 移動 / `clear()` / `setOnFrameReady` 上書き



`WebSocketClient.ts` (93), `StreamFrameProvider.ts` (82)。

- **追加テスト**:
  - `tests/ts/stream/WebSocketClient.test.ts`: `globalThis.WebSocket` をスタブ化し open / message / close / 自動再接続のステートマシンを検証
  - `tests/ts/stream/StreamFrameProvider.test.ts`: バッファリング / シーク / `provider` インターフェース (`usePlaybackStore` から呼ばれる契約) を検証
- **既存契約参照**: `src/stores/usePlaybackStore.ts` の `setProvider` / `currentFrameData` 経路 (`MeganeViewer.tsx:122,140` で利用)
- **規模**: S

## Phase 3 — `src/ai/` (純粋ロジック先行、ネットワークは後回し) ✅ DONE (`db0b679`)

**実施内容**: 以下 4 ファイル / 42 テストを追加。`fetch` を `vi.stubGlobal` でモックし、SSE は `ReadableStream` を Response 本体に渡す `makeSSEResponse` ヘルパで合成。`src/ai/skillLoader.ts` の `parseFrontmatter` を 1 行だけ `export` に昇格 (ロードマップが許容する「テスト + 必要最小の export 追加」枠)。

- `tests/ts/ai/config.test.ts` (93 LOC, 8 tests): zustand store の localStorage 読み書き / `apiKey` を絶対に永続化しない不変条件 / 不正 JSON 耐性 / `setProvider` でのデフォルトモデル切替 / `PROVIDER_MODELS` 構造
- `tests/ts/ai/prompt.test.ts` (45 LOC, 6 tests): 全ノードタイプ・スキーマ version 3 マーカー・JSON コードフェンス・`Connection Rules` 節の存在 / 決定性
- `tests/ts/ai/skillLoader.test.ts` (121 LOC, 13 tests): `parseFrontmatter` のフロントマターあり/なし、コロンなし行、値中コロン、空ボディ / `buildToolDefinitions` の kebab→snake / `executeSkill` のマッチ・null / `loadSkills` (空ディレクトリ) / `getSkills` キャッシュ
- `tests/ts/ai/client.test.ts` (280 LOC, 15 tests): `extractPipelineJSON` の fenced/raw/malformed/version 不一致/配列欠落分岐 / Anthropic SSE フローの text-only / tool_use → tool_result 往復 / ヘッダ・ボディ検証 / non-OK status 例外 / OpenAI SSE フローの delta / `[DONE]` / 不正 JSON 行スキップ / non-OK status 例外



`config.ts` (80), `prompt.ts` (196), `skillLoader.ts` (128), `client.ts` (354)。

- **追加テスト** (純粋部分):
  - `tests/ts/ai/config.test.ts`: env / context からの設定解決
  - `tests/ts/ai/prompt.test.ts`: メッセージ構築 / トークン截断 / システムプロンプト合成
  - `tests/ts/ai/skillLoader.test.ts`: `src/ai/skills/*.md` のロード (`?raw` import の vitest モックを用意)
- **`client.ts` (354 行) はネットワーク**: `fetch` をモックして requestId 取り回しと SSE / chunk parser のみ単体化、本物の API は E2E に任せる
- **既存利用箇所**: `src/components/PipelineChatBox.tsx:?` (テスト時に AI 経路をスタブできる import 構造を確保)
- **規模**: M (`client.ts` の SSE パーサ周りはやや厚い)

## Phase 4 — `src/renderer/` 純粋ヘルパのみ (WebGL は除外)

`MoleculeRenderer.ts` (1504) は WebGL 直結のため単体不可。**math / state / 純粋クラス** だけ拾う。

- **対象 (テスト可能と判断)**:
  - `Selection.ts` (82): セット操作 / トグル
  - `Picking.ts` (158): 線分・球の交差判定など (Three.js Raycaster を使うコードは jsdom + `three` の純粋 math API に閉じる範囲)
  - `CameraManager.ts` (195): フィット計算 / 行列セットアップの非 GL 部分
  - `shaders.ts` (250): エクスポートされる定数 / GLSL テンプレート関数の文字列出力
- **対象外** (E2E に任せる): `MoleculeRenderer.ts`, `*Mesh.ts`, `*Renderer.ts` の WebGL 命令経路、`RenderCapture.ts`
- **追加テスト**: `tests/ts/renderer/Selection.test.ts`, `Picking.test.ts`, `CameraManager.test.ts`, `shaders.test.ts`
- **注意**: `three` の `WebGLRenderer` を import すると jsdom で死ぬため、テストは `Selection` / `Picking` / `CameraManager` を **個別 import** し、副作用 import を避ける
- **規模**: M

## Phase 5 — `src/components/nodes/` (xyflow ノード UI)

12 ファイル (合計 1,359 行)。`NodeShell.tsx` (308) と `PolyhedronGeneratorNode.tsx` (246) が大物。

- **追加テスト** (`@testing-library/react` で props/render のスナップショット的検証):
  - `tests/ts/components/nodes/NodeShell.test.tsx`: タイトル / ハンドル / 折りたたみトグル
  - 各ノードタイプの最小レンダ (12 件 → 段階的に追加。最初は `LoadStructureNode`, `AddBondNode`, `FilterNode`, `ViewportNode` の 4 件)
- **既存契約参照**: `src/pipeline/types.ts` の各 `*Params` 型 (props バリデーション)
- **既存パターン**: `tests/ts/components/Tooltip.test.tsx` を参照
- **規模**: M (UI が多いので分割 PR 推奨: `NodeShell + 4 件` → `残り 8 件` の 2 PR)

## Phase 6 — `jupyterlab-megane/src/` (小ファイル中心)

`factory.ts` (42), `filetypes.ts` (89), `wasmLoader.ts` (38), `skillLoaderStub.ts` (39), `index.ts` (126), `MeganeDocWidget.tsx` (204), `MeganePipelineDocWidget.tsx` (245)。

- **追加テスト** (JupyterLab API は最小モック):
  - `tests/ts/jupyterlab/filetypes.test.ts`: 拡張子 → MIME マッピングの網羅
  - `tests/ts/jupyterlab/wasmLoader.test.ts`: `__webpack_public_path__` 注入 / fetch URL 解決
  - `tests/ts/jupyterlab/factory.test.ts`: コンストラクト時の依存配線
- **DocWidget は対象外**: `MeganeDocWidget.tsx`, `MeganePipelineDocWidget.tsx` は JupyterLab DocumentWidget / Comm 直結なので E2E (`tests/e2e/jupyterlab-doc.spec.ts`) に任せる
- **規模**: S

## Phase 7 — `vscode-megane/src/` (vscode API モック必須)

`extension.ts` (257), `webview/main.tsx` (206)。

- **追加テスト**:
  - `tests/ts/vscode/extension.test.ts`: `vitest` の `vi.mock("vscode", ...)` で vscode API をモックし、`activate()` のコマンド登録 / contentProvider / postMessage 経路を検証
  - `webview/main.tsx` のメッセージハンドラ部分はモジュール分割して純粋関数化したうえでテスト (本格的な分割は別タスク)
- **既存契約参照**: `vscode-megane/webview/main.tsx:43-50` の `event.data` ディスパッチ
- **規模**: M (vscode モック作成のオーバーヘッドあり)

## Phase 8 — codecov しきい値の段階引き締め (締め)

- `codecov.yml` の `threshold: 1%` を **`2%` (project) / `1%` (patch)** に
- `fail_ci_on_error: true` を main マージ後に有効化
- `flag_management` の `paths` を実態に合わせて見直し (Phase 6 で `jupyterlab-megane/src/` のテストが揃った時点で carryforward 切替)
- **対象ファイル**: `codecov.yml`, `.github/workflows/ci.yml`
- **規模**: S

## 推奨実行順 / 並列性

```
Phase 0 (codecov flag fix)        ✅ DONE (c17462a)
   │
   ├─ Phase 1 (tour)              ✅ DONE (b03bf04)
   ├─ Phase 2 (stream)            ✅ DONE (61ada6e)
   └─ Phase 3 (ai)                ✅ DONE (db0b679)
        │
        ├─ Phase 4 (renderer pure helpers)   ⬜ TODO
        └─ Phase 5 (nodes UI)                 ⬜ TODO  ← 2 PR に分割
             │
             ├─ Phase 6 (jupyterlab small files)  ⬜ TODO
             └─ Phase 7 (vscode extension)        ⬜ TODO
                  │
                  └─ Phase 8 (threshold tighten)  ⬜ TODO
```

各フェーズは独立 PR。1, 2, 3 は依存無しで並列着手可。

## Critical Files (横断的に触る場所)

| 用途 | ファイル |
|---|---|
| codecov 設定 | `codecov.yml` |
| CI ワークフロー | `.github/workflows/ci.yml` |
| vitest 設定 | `vitest.config.ts` (新規 dir 追加時に include 確認) |
| テスト共通 setup | `tests/ts/setup.ts` (vscode mock などを追加する場合の唯一の編集点) |
| 参照する既存テストパターン | `tests/ts/stores/usePlaybackStore.test.ts`, `tests/ts/components/Tooltip.test.tsx`, `tests/ts/pipeline/store.test.ts` |

## 検証 (各フェーズ共通)

1. `npm run build:wasm` (CRITICAL RULE 3)
2. `npm test -- --coverage` でローカル確認 (`coverage/ts/index.html` を開いて当該ディレクトリの差分を目視)
3. `npm run lint` & `npm run format:check`
4. push → `gh pr create` (CRITICAL RULE 4) → `gh run list` で CI 緑確認 → codecov コメントでフラグ別差分確認
5. `cargo test -p megane-core` は Rust に触らないフェーズではスキップ可

## Delivery — このロードマップ自体を repo に commit / push / PR

ユーザの指示: 「markdown にして push して PR を作る」。本ファイル (`/root/.claude/plans/serialized-conjuring-lobster.md`) を **repo 内にコピー** し、現行ブランチで push、PR 作成までを 1 連の作業として行う。

- **配置先**: `docs/plans/test-coverage-roadmap.md`
  - 既存 `docs/` (Docusaurus) 配下。`docs/plans/` は新規作成。
  - 内容は `/root/.claude/plans/serialized-conjuring-lobster.md` をそのままコピー (英訳はしない — 既存日本語のまま、見出しも維持)。
- **ブランチ**: `claude/plan-code-refactoring-sbhU8` (既に checkout 済み、CLAUDE.md 指定どおり)
- **コミット**:
  - `git status` / `git diff` / `git log -1` を確認 (commit skill 準拠)
  - 追加ファイルのみステージ (`git add docs/plans/test-coverage-roadmap.md`)。`-A` / `.` は使わない
  - メッセージ (英語、CRITICAL RULE 1):
    ```
    docs: add test coverage roadmap for under-tested areas

    Capture multi-PR plan to add unit tests for src/ai, src/stream, src/tour,
    src/components/nodes, src/renderer pure helpers, jupyterlab-megane/src,
    and vscode-megane/src, plus codecov flag/threshold tightening.

    https://claude.ai/code/<session-id>
    ```
- **Push**: `git push -u origin claude/plan-code-refactoring-sbhU8` (失敗時は 2s/4s/8s/16s の指数バックオフで最大 4 回)
- **PR 作成**: `mcp__github__create_pull_request` (gh CLI は使えないため GitHub MCP)
  - base: `main`
  - head: `claude/plan-code-refactoring-sbhU8`
  - title (英語、< 70 文字): `docs: add test coverage roadmap`
  - body: 下記テンプレ
    ```
    ## Summary
    - Add a multi-PR roadmap (`docs/plans/test-coverage-roadmap.md`) covering
      unit tests for currently untested areas: src/ai, src/stream, src/tour,
      src/components/nodes, src/renderer pure helpers, jupyterlab-megane/src,
      vscode-megane/src.
    - Phase 0 fixes the codecov flag/upload mismatch so per-flag status works.
    - Phase 8 tightens codecov threshold once coverage is in place.

    ## Test plan
    - [ ] Reviewer reads `docs/plans/test-coverage-roadmap.md` end-to-end
    - [ ] No code changes in this PR — CI should pass on docs-only diff
    ```
- **CI 確認**: PR 作成後 `mcp__github__list_pull_requests` または `mcp__github__pull_request_read` で番号確認 → CI run の status を取得して緑を確認 (CRITICAL RULE 4)。docs-only diff のため大半のジョブはスキップされる想定。

### この Delivery で必要な write 系操作 (plan 承認後に実行)

1. `mkdir -p docs/plans` (Bash)
2. `cp /root/.claude/plans/serialized-conjuring-lobster.md docs/plans/test-coverage-roadmap.md` (Bash) — 内容修正なしの単純コピー
3. `git add docs/plans/test-coverage-roadmap.md` → `git commit -m ...` (Bash, HEREDOC)
4. `git push -u origin claude/plan-code-refactoring-sbhU8` (Bash)
5. `mcp__github__create_pull_request` (MCP)
6. `mcp__github__list_pull_requests` で CI 確認 (MCP)

`build:wasm` / `npm test` 等は **本 PR には不要** (docs-only)。Phase 1 以降の実装 PR で必須となる。

## 範囲外 (本ロードマップでは扱わない)

- `MoleculeRenderer.ts` 1504 行の god class 分解 → 別タスク
- `PipelineEditor.tsx` 857 行の責務分離 → 別タスク
- `useMeganeLocal.ts` 400 行の `useReducer` 化 → 別タスク
- ホスト統合 (`useIntegratedViewer`) などの共通化 → 別タスク
- パーサ dispatch (TS / Rust 横断) → 別タスク
