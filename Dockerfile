# Stage 1: Build frontend
FROM node:20-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json tsconfig.node.json vite.config.ts vite.widget.config.ts index.html ./
COPY src/ src/
RUN npm run build

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
RUN pip install --no-cache-dir .

# Copy built frontend (app + widget)
COPY --from=frontend /app/python/megane/static/ python/megane/static/

# Copy demo data
COPY tests/fixtures/1crn.pdb /data/1crn.pdb

EXPOSE 8080

CMD ["megane", "serve", "/data/1crn.pdb", "--port", "8080", "--no-browser"]
