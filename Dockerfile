# Stage 0: Build WASM PDB parser
FROM rust:1.93-slim AS wasm
RUN rustup target add wasm32-unknown-unknown && cargo install wasm-pack
WORKDIR /app
COPY Cargo.toml ./
COPY crates/ crates/
COPY wasm/ wasm/
RUN cd wasm && wasm-pack build --target web --release

# Stage 1: Build Python native extension (megane-parser)
# Use python:3.11 as base to match the runtime stage Python version
FROM python:3.11-slim AS pyext
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential && \
    rm -rf /var/lib/apt/lists/* && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    pip install --no-cache-dir maturin
ENV PATH="/root/.cargo/bin:${PATH}"
WORKDIR /app
COPY Cargo.toml ./
COPY crates/ crates/
COPY wasm/ wasm/
RUN cd crates/megane-python && maturin build --release --out /app/dist

# Stage 2: Build frontend
FROM node:20-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=wasm /app/wasm/pkg/ wasm/pkg/
COPY tsconfig.json tsconfig.node.json vite.config.ts vite.widget.config.ts index.html ./
COPY src/ src/
RUN npx tsc && npx vite build && npx vite build --config vite.widget.config.ts

# Stage 3: Python runtime
FROM python:3.11-slim AS runtime
WORKDIR /app

# Install the native extension wheel
COPY --from=pyext /app/dist/*.whl /tmp/
RUN pip install --no-cache-dir /tmp/*.whl && rm /tmp/*.whl

# Install Python deps
COPY pyproject.toml ./
COPY python/ python/
COPY --from=frontend /app/python/megane/static/ python/megane/static/
RUN test -f python/megane/static/app/index.html || (echo "ERROR: Frontend build missing app/index.html" && exit 1)
RUN pip install --no-cache-dir ".[trajectory]"

# Copy demo data
COPY tests/fixtures/1crn.pdb /data/1crn.pdb
COPY tests/fixtures/1crn_vibration.xtc /data/1crn_vibration.xtc

EXPOSE 8080

CMD ["megane", "serve", "/data/1crn.pdb", "--xtc", "/data/1crn_vibration.xtc", "--port", "8080", "--no-browser"]
