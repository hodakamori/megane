.PHONY: build build-frontend install dev test clean

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

# Run tests
test:
	pytest

# Clean build artifacts
clean:
	cargo clean
	rm -rf python/megane/static/app python/megane/static/widget.js
	rm -rf dist/ *.egg-info/ target/
