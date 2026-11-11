# Northfen pressure washer owner's manual (DITA 1.3 sample)

A short owner's manual written in DITA 1.3 XML for a fictional product line:
the **Northfen PW-1900E** electric pressure washer for home use and the
**Northfen PW-3400G** gas pressure washer for professional use. Northfen and
both models are invented for this portfolio sample. The content is not
taken from any real manufacturer's documentation.

One set of source files produces two complete manuals, one per model, in
both web and PDF formats.

Author: Avalynn Circe

## What this sample shows

| Skill | Where to look |
|---|---|
| Topic-based authoring with the three core information types | `topics/` (`c_` concept, `t_` task, `r_` reference) |
| Structured safety messages (ANSI Z535 style signal words, hazard, consequence, avoidance) | `<hazardstatement>` in `shared/warnings.dita` |
| Single-sourcing safety content with conkeyref | `shared/warnings.dita` and every topic that pulls from it |
| Variables with keys and keyref | `<keydef>` elements in `pressure-washer.ditamap` |
| Conditional content for two products from one source | `@product` attributes and `ditaval/` |
| Controlled vocabulary for profiling values | `subject-scheme.ditamap` |
| Minimalist, task-oriented procedures | `topics/t_set_up_and_start.dita` |
| A DITA-OT plugin that customizes HTML5 and PDF output | `plugins/com.circe.northfen/` |
| A branded web stylesheet with ANSI Z535 panel colors | `web/northfen.css` |

## File structure

```
dita-pressure-washer/
├── pressure-washer.ditamap        Main map: key definitions and navigation
├── subject-scheme.ditamap         Allowed values for @product
├── ditaval/
│   ├── electric.ditaval           Filter for the PW-1900E manual
│   └── gas.ditaval                Filter for the PW-3400G manual
├── shared/
│   └── warnings.dita              Warehouse topic: every safety message, once
├── topics/
│   ├── c_safety_information.dita  Concept: signal words, safety messages, PPE
│   ├── c_how_it_works.dita        Concept: water path, bypass mode, nozzles
│   ├── t_set_up_and_start.dita    Task: connect, purge air, start
│   ├── t_shut_down_and_store.dita Task: stop, relieve pressure, drain, store
│   ├── r_specifications.dita      Reference: specifications table
│   └── r_troubleshooting.dita     Reference: problem, cause, solution table
├── plugins/
│   └── com.circe.northfen/        DITA-OT plugin: NOTICE panels and contents-page header
├── web/
│   ├── northfen.css               Stylesheet for the web manuals
│   ├── header-electric.xml        Top bar for the PW-1900E web manual
│   ├── header-gas.xml             Top bar for the PW-3400G web manual
│   └── head.xml                   Viewport tag for phones
├── build.sh                       Installs the plugin and builds all four outputs
└── README.md
```

## How reuse works

### 1. Safety messages: write once, use everywhere

Every safety message lives in one warehouse topic, `shared/warnings.dita`,
as a `<hazardstatement>` with its own ID. The map defines a key for that
file with `processing-role="resource-only"`, so the warehouse never
appears in the output on its own:

```xml
<keydef keys="warnings" href="shared/warnings.dita" processing-role="resource-only"/>
```

Topics pull a message in by key and ID:

```xml
<hazardstatement conkeyref="warnings/w-injection">...</hazardstatement>
```

The injection hazard appears in three places in the built manual, but its
text exists once. A legal or safety review approves one message, and a
change to it updates every topic on the next build. Because the reference
goes through a key rather than a file path, the warehouse can move or be
swapped for a different file by changing one line in the map.

### 2. Two models from one source

Content that applies to only one model carries a `@product` attribute:

```xml
<step product="gas">
  <cmd>Check the engine oil level.</cmd>
</step>
```

Each DITAVAL file excludes the other model's content at build time. The
specifications table is a good example: it holds rows for both models, and
each built manual shows only its own. Safety messages work the same way.
The carbon monoxide danger appears only in the gas manual, and the
electric shock warning appears only in the electric manual. Each conkeyref
to a model-specific message carries the same `@product` value as the
message, so filtering removes the reference and its target together.

### 3. Product names and values as keys

The map defines `product-name`, `model` and `max-pressure` twice, once per
model, each with a `@product` value. After filtering, one definition
remains, so a single line in a topic resolves to the right text in each
manual:

```xml
<shortdesc>Technical data for the <keyword keyref="product-name"/>.</shortdesc>
```

### 4. Safety panels that follow ANSI Z535

DANGER, WARNING and CAUTION panels carry the safety alert symbol. NOTICE is
for property damage only, so under ANSI Z535.6 it carries no symbol. The
toolkit's default puts the triangle on every panel. The
`com.circe.northfen` plugin overrides the HTML5 and PDF templates so a
NOTICE renders as a blue panel with the signal word and no symbol. The
plugin also lets long lines in PDF safety panels wrap inside the panel.

### 5. Controlled values

`subject-scheme.ditamap` limits `@product` to `electric` and `gas`. If a
writer types `product="eletric"`, the toolkit reports it at build time
instead of silently publishing content to neither manual.

## Building the output

These steps use the free [DITA Open Toolkit](https://www.dita-ot.org/)
(DITA-OT), version 4.x.

1. Install Java 17 or later.
2. Download DITA-OT from the [DITA-OT downloads page](https://www.dita-ot.org/download)
   and unzip it.
3. Add the toolkit's `bin` folder to your PATH, then check it:
   ```
   dita --version
   ```
4. From this folder, build all four manuals:
   ```
   ./build.sh
   ```
   The script installs the `com.circe.northfen` plugin into your toolkit,
   then builds web and PDF output for each model. The web builds pass the
   stylesheet and header files from `web/` with absolute paths, because
   DITA-OT resolves those arguments from its own folder:
   ```
   dita --input=pressure-washer.ditamap --format=html5 \
        --filter=ditaval/electric.ditaval --output=out/electric/html5 \
        --nav-toc=full \
        --args.css="$PWD/web/northfen.css" --args.copycss=yes --args.csspath=css \
        --args.hdr="$PWD/web/header-electric.xml" --args.hdf="$PWD/web/head.xml"
   ```

5. Open `out/electric/html5/index.html` in a browser, or the PDF in
   `out/electric/pdf/`.

### Publishing on Circe Docs

The `out/` folder is not committed. After a build, copy each model's
output into the site's static folder, replacing what is there:

```
for model in electric gas; do
  rm -rf ../static/dita/pressure-washer/$model/html5 ../static/dita/pressure-washer/$model/pdf
  cp -r out/$model/html5 out/$model/pdf ../static/dita/pressure-washer/$model/
done
```

The links in `web/header-*.xml` assume the site serves these files at
`/circe-docs/dita/pressure-washer/`.

## Validation

All topics and maps validate against the OASIS DITA 1.3 DTDs (checked
with `xmllint --valid` and the DITA-OT catalog). The DITAVAL files have
no DTD and are checked as well-formed XML.
