#!/usr/bin/env bash
# Builds web (HTML5) and PDF output for both models with DITA Open Toolkit.
# Requires the dita command on your PATH. See README.md.
set -euo pipefail
cd "$(dirname "$0")"
for model in electric gas; do
  dita --input=pressure-washer.ditamap --format=html5 \
       --filter="ditaval/${model}.ditaval" --output="out/${model}/html5"
  dita --input=pressure-washer.ditamap --format=pdf \
       --filter="ditaval/${model}.ditaval" --output="out/${model}/pdf"
done
echo "Done. Open out/electric/html5/index.html or out/gas/pdf/*.pdf"
