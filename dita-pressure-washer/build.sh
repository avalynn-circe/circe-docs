#!/usr/bin/env bash
# Builds web (HTML5) and PDF output for both models with DITA Open Toolkit.
# Requires the dita command on your PATH. See README.md.
set -euo pipefail
cd "$(dirname "$0")"

# The Northfen plugin drops the safety alert symbol from NOTICE messages and
# adds the header bar to the contents page. It is reinstalled on every build so
# edits to the plugin always take effect. dita install takes a ZIP, so the
# plugin folder is zipped to a temp file first.
zipfile="$(mktemp -d)/com.circe.northfen.zip"
(cd plugins && zip -qr "$zipfile" com.circe.northfen)
dita install "$zipfile" --force

for model in electric gas; do
  dita --input=pressure-washer.ditamap --format=html5 \
       --filter="ditaval/${model}.ditaval" --output="out/${model}/html5" \
       --nav-toc=full \
       --args.css="$PWD/web/northfen.css" --args.copycss=yes --args.csspath=css \
       --args.hdr="$PWD/web/header-${model}.xml" --args.hdf="$PWD/web/head.xml"
  dita --input=pressure-washer.ditamap --format=pdf \
       --filter="ditaval/${model}.ditaval" --output="out/${model}/pdf"
done
echo "Done. Open out/electric/html5/index.html or out/gas/pdf/*.pdf"
