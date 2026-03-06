#!/bin/bash
# Convert prepared notebooks to HTML for embedding in VitePress docs.
#
# Prerequisites:
#   pip install nbconvert
#   python3 docs/scripts/prepare-notebooks.py  (run first to create notebooks with outputs)
#
# Usage:
#   bash docs/scripts/convert-notebooks.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
INPUT_DIR="$ROOT/docs/notebooks"
OUTPUT_DIR="$ROOT/docs/public/notebooks"

mkdir -p "$OUTPUT_DIR"

echo "Converting notebooks to HTML..."

for nb in "$INPUT_DIR"/*.ipynb; do
  name="$(basename "$nb")"
  echo "  Converting $name..."
  jupyter nbconvert --to html \
    --no-prompt \
    --template lab \
    --embed-images \
    "$nb" \
    --output-dir "$OUTPUT_DIR"
done

echo "Done. HTML files written to $OUTPUT_DIR"
