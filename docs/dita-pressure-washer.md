---
title: "DITA sample: pressure washer manual"
description: One DITA 1.3 source produces two owner's manuals, electric and gas, in HTML5 and PDF. Shared safety messages come from a single warehouse topic, and product filtering selects the content for each model.
---

# DITA sample: pressure washer manual

A short owner's manual written in DITA 1.3 XML for a fictional product line, the Northfen PW-1900E electric pressure washer and the Northfen PW-3400G gas pressure washer. Northfen and both models are invented for this sample. One set of source files, built with DITA Open Toolkit 4.4.1, produces two complete manuals in two formats.

## The built manuals

| Model | Web (HTML5) | PDF |
|---|---|---|
| PW-1900E electric | [Electric manual, web](pathname:///dita/pressure-washer/electric/html5/index.html) | [Electric manual, PDF](pathname:///dita/pressure-washer/electric/pdf/pressure-washer.pdf) |
| PW-3400G gas | [Gas manual, web](pathname:///dita/pressure-washer/gas/html5/index.html) | [Gas manual, PDF](pathname:///dita/pressure-washer/gas/pdf/pressure-washer.pdf) |

The source is in the [dita-pressure-washer folder](https://github.com/avalynn-circe/circe-docs/tree/main/dita-pressure-washer) of this site's repository. `build.sh` builds all four outputs.

## How the single source works

### Shared safety messages

Every safety message lives once, in the warehouse topic `shared/warnings.dita`, as a `<hazardstatement>` with its own ID. There are seven: injection, stored pressure, electric shock, carbon monoxide, fuel fire, freeze damage, and running dry. The map binds the warehouse to a key and marks it `processing-role="resource-only"`, so the warehouse never appears in the output as a page of its own.

```xml
<keydef keys="warnings" href="shared/warnings.dita" processing-role="resource-only"/>
```

Topics pull a message in by key and ID with `conkeyref`. Four topics pull seventeen messages between them. The injection warning appears three times in each manual, but its text exists once. A change to it updates every topic on the next build.

```xml
<hazardstatement conkeyref="warnings/w-injection"/>
```

### Electric and gas filtering

Content that applies to one model carries a `product` attribute with the value `electric` or `gas`. Each build uses one DITAVAL file, which includes one value and excludes the other.

```xml
<val>
  <prop att="product" val="electric" action="include"/>
  <prop att="product" val="gas" action="exclude"/>
</val>
```

Filtering reaches every level of the source:

- Steps. The gas setup task has a step to check the engine oil. The electric manual never shows it.
- Table rows. The specifications table holds rows for both models. Each manual shows its own.
- Safety messages. The carbon monoxide danger carries `product="gas"` in the warehouse, and so does each `conkeyref` that pulls it. Filtering removes the message and the reference together.
- Key definitions. The map defines `product-name`, `model`, and `max-pressure` twice, once per model. After filtering, one definition remains, so a single `keyref` in a topic resolves to the right text in each manual.

A subject scheme map limits `product` to the two listed values. A typo such as `product="eletric"` is reported at build time.

### What the build confirms

The electric HTML output contains the string PW-1900E and never PW-3400G, carbon monoxide, or engine oil. The gas output is the mirror image. Both PDFs carry their own model name.
