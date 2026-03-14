.PHONY: build build-frontend install dev test test-widget test-e2e test-e2e-snapshot test-e2e-widget-snapshot test-e2e-widget-snapshot-update test-ts test-rust test-all coverage coverage-ts coverage-rust coverage-all clean preview preview-screenshot preview-video preview-clean

# Build frontend assets (WASM + TypeScript)
build-frontend:
	npm run build

# Build wheel (frontend + Rust extension)
build: build-frontend
	maturin build --release

# Development install (editable)
dev:
	npm run build
	maturin develop --release

# Production install
install: build-frontend
	pip install .

# Run Python tests
test:
	python -m pytest

# Run widget Python tests only
test-widget:
	python -m pytest tests/python/test_widget.py -v

# Run E2E browser test (requires playwright + chromium)
test-e2e:
	node tests/e2e/test_widget_render.mjs

# Run TypeScript unit + component tests
test-ts:
	npm test

# Run Rust unit tests
test-rust:
	cargo test -p megane-core

# Run E2E snapshot tests (Playwright + Vite dev server)
test-e2e-snapshot:
	node tests/e2e/snapshot.test.mjs

# Run E2E widget snapshot tests (Playwright + JupyterLab)
test-e2e-widget-snapshot:
	node tests/e2e/widget_snapshot.test.mjs

# Update widget snapshot baselines
test-e2e-widget-snapshot-update:
	node tests/e2e/widget_snapshot.test.mjs --update

# Run all tests (Python + TypeScript + Rust + E2E)
test-all: test test-ts test-rust test-e2e test-e2e-snapshot test-e2e-widget-snapshot

# Run TypeScript tests with coverage
coverage-ts:
	npx vitest run --coverage

# Run Python tests with coverage
coverage:
	python -m pytest --cov=megane --cov-report=term-missing --cov-report=html:coverage/python

# Run Rust tests with coverage (requires cargo-tarpaulin)
coverage-rust:
	cargo tarpaulin -p megane-core --out Html --output-dir coverage/rust

# Run all coverage reports
coverage-all: coverage coverage-ts coverage-rust
	@echo ""
	@echo "Coverage reports generated:"
	@echo "  Python:     coverage/python/index.html"
	@echo "  TypeScript: coverage/ts/index.html"
	@echo "  Rust:       coverage/rust/tarpaulin-report.html"

# Dev preview: capture screenshots + video for mobile dev review
preview:
	node scripts/dev-preview.mjs --interact

# Dev preview: screenshots only
preview-screenshot:
	node scripts/dev-preview.mjs --screenshot

# Dev preview: video only
preview-video:
	node scripts/dev-preview.mjs --video --interact

# Dev preview: clean previous captures
preview-clean:
	rm -rf dev-preview/

# Clean build artifacts
clean:
	cargo clean
	rm -rf python/megane/static/app python/megane/static/widget.js
	rm -rf dist/ *.egg-info/ target/
