.PHONY: build build-frontend install dev test test-widget test-e2e test-e2e-snapshot test-ts test-rust test-all clean

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

# Run all tests (Python + TypeScript + Rust + E2E)
test-all: test test-ts test-rust test-e2e test-e2e-snapshot

# Clean build artifacts
clean:
	cargo clean
	rm -rf python/megane/static/app python/megane/static/widget.js
	rm -rf dist/ *.egg-info/ target/
