# Stage 0: Build WASM PDB parser
FROM rust:1.93-slim AS wasm
RUN rustup target add wasm32-unknown-unknown && cargo install wasm-pack
WORKDIR /app
COPY wasm/ wasm/
RUN cd wasm && wasm-pack build --target web --release

# Stage 1: Build frontend
FROM node:20-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=wasm /app/wasm/pkg/ wasm/pkg/
COPY tsconfig.json tsconfig.node.json vite.config.ts vite.widget.config.ts index.html ./
COPY src/ src/
COPY public/ public/
RUN npx tsc && npx vite build && npx vite build --config vite.widget.config.ts

# Stage 2: Python runtime
FROM python:3.11-slim AS runtime
WORKDIR /app

# Install system deps for rdkit
RUN apt-get update && apt-get install -y --no-install-recommends \
    libxrender1 libxext6 && \
    rm -rf /var/lib/apt/lists/*

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
