---
name: ebay-card-deals
description: >-
  Finds underpriced basketball trading cards on eBay. Pulls sold comps for a
  card (bucketed by grade, serial numbering, auto/patch), pulls the live
  listings, and ranks the live ones by how far under the comps they sit, with
  a reason each one is cheap and what to verify before buying. Use this
  whenever someone wants to find deals, steals, undervalued, mispriced, or
  "below market" basketball cards, wants to know what a card is worth or
  what it sells for on eBay, wants to snipe auctions, hunt misspelled
  listings, or decide whether a listing price is good. Trigger on player
  names plus card words (Prizm, Optic, Select, Mosaic, National Treasures,
  PSA, BGS, SGC, rookie, RC, parallel, /99), even when "eBay" is not said.
  Also use for other sports cards; the method is the same, the nickname
  table is basketball-only.
---

# eBay basketball card deals

A card is underpriced when its all-in price (item plus shipping) sits well
below what the same card, in the same grade, sold for recently. Everything
in this skill serves that one comparison: get a trustworthy "recent sold"
number, get the live listings, line them up, then explain why the cheap
ones are cheap, because the reason decides whether it is a deal or a trap.

## Tooling

`scripts/ebay_cards.py` does the fetching, parsing, and scoring. Python 3.10+,
standard library only. Run it with `python3 <skill-path>/scripts/ebay_cards.py`.

| Subcommand | What it does |
|---|---|
| `scan -q "<card>"` | The main move. Sold comps + live listings, ranked by deal score. |
| `comps -q "<card>"` | Sold price statistics only (median, p25/p75, trend, by grade). |
| `active -q "<card>"` | Live listings only, cheapest first. |
| `misspell --name "<player>"` | Misspellings and nicknames to search for buried listings. |
| `parse <saved.html>` | Parse an eBay search page saved from a browser. For debugging or offline use. |

Useful flags on `scan`, `comps`, `active`:

- `--grade "PSA 10"` or `--grade raw` forces the comp bucket when the query
  does not say it. `--serial 99` forces numbering.
- `--must silver rc` and `--must-not reprint lot` tighten title matching.
- `--days 60` narrows the sold window (default 90).
- `--format bin|auction`, `--max-price`, `--min-price` on live listings.
- `--pages 2` fetches more sold results (240 per page) for popular cards.
- `--json out.json` saves everything, including each listing's parsed card
  attributes and scoring reasons. Read that file when you need details the
  table truncates.
- `--sold-file a.html --active-file b.html` run the pipeline on pages the
  user saved from their browser. See "When eBay blocks the script" below.

Data sources: live listings come from the eBay Browse API when
`EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET` are set in the environment (free
developer keys from developer.ebay.com), otherwise from eBay's search HTML.
Sold prices always come from the search HTML, since the public API does not
expose them. The script waits 2 seconds between pages. Keep it that way; a
burst of requests gets the user's IP a bot-check page for the day.

## Workflow

### 1. Pin down the card before searching

Price is decided by a handful of attributes, and a comp set that mixes them
is worthless. From the user's request, settle:

- **Player, year, set** (e.g. 2018-19 Panini Prizm). If the user only gives
  a player, ask which card or default to the flagship rookie: Prizm base
  and Silver for 2012 onward, Topps Chrome for 2003-2009, Fleer/Topps/
  Skybox for older eras. Say which one you picked.
- **Parallel and serial numbering** (Silver, Red Ice /99, Gold /10). Base
  and Silver of the same card can differ 10x.
- **Grade bucket**: raw, PSA 10, PSA 9, BGS 9.5, SGC 10, and so on. The
  script parses the grade from titles and compares like with like. A user
  who says "the Luka silver" without a grade usually wants to see both raw
  and PSA 10, so run `comps` once and read the "By grade bucket" table
  before choosing which bucket to `scan`.
- **Auto, patch, RPA** change the market entirely. The script keeps these
  separate automatically.

`references/card-attributes.md` lists how each attribute moves price and
which ones sellers most often omit or get wrong. Read it when the request
involves a parallel or product you do not know well.

### 2. Run the scan and read the comps line first

```bash
python3 scripts/ebay_cards.py scan -q "2018 prizm luka doncic silver psa 10" --json /tmp/luka.json
```

The first line of output is the comp summary: count, median, p25, p75, and
the 30-day trend. Judge it before trusting any deal below it:

- Fewer than 5 comps: the median is a guess. Widen `--days`, add `--pages 2`,
  or loosen the query. Say in the answer that comps are thin.
- Spread (p75 minus p25) above about 40% of the median: the market is not
  agreeing on a price, often because the query mixes two cards. Tighten
  with `--must` or `--must-not` and rerun.
- Trend below -15%: the card is falling. A listing 20% under a 90-day
  median may sit right at today's price. The script already discounts the
  score for this; mention it.
- Auction median well below BIN median: patient buyers get it cheaper at
  auction, which changes what "a deal" means for a BIN.

### 3. Rank and explain

The score is roughly "percent under the median", then tempered by
confidence (comp count and spread), format (an auction with days left is
not a price, it is a placeholder), and risk (new seller, disclosed damage,
discounts so deep they signal a reprint or a scam). The `why` column gives
the reasons it might be cheap; the `cautions` column gives what could make
it not a deal. Both matter more than the number.

The most common honest reasons a card is underpriced, in rough order of how
often they pay off:

1. **Bad title.** Misspelled player, missing set name, no "RC", no parallel
   named, card number only. Buyers search by keyword, so these listings get
   a fraction of the eyes. The script flags misspellings and missing target
   words. Verify the card in the photos.
2. **Best Offer.** The ask is not the price. An OBO listing 15% under
   median is often 30% under after an offer.
3. **Auction ending at a bad hour** with few watchers. Only auctions under
   a few hours old count; the script scores longer ones near zero.
4. **Seller does not know what they have.** Estate lots, "found in a
   closet", collection sell-offs, listings with a single blurry photo.
5. **Market just moved.** A player got traded, injured, or went on a run,
   and listings priced last week are stale. Comps lag too, so check the
   30-day median against the 90-day one.

And the common reasons a cheap listing is not a deal: reprints and
"facsimile" cards, trimmed or recolored cards sold as raw, graded by a
grader the market discounts (the script buckets these separately, but
"PSA 10" and "GMA 10" are different worlds), damage disclosed only in
the photos, shipping or import charges that erase the gap, and sellers with
no history. A listing more than 70% under a solid median is a scam until
the photos prove otherwise.

### 4. Hunt beyond the obvious query

A single clean query finds listings that every other buyer already sees. The
real discounts live in listings nobody finds. `references/hunting-grounds.md`
is the list of where they hide and the query for each; use at least two of
them on any serious hunt:

```bash
python3 scripts/ebay_cards.py misspell --name "Luka Doncic" --set prizm
python3 scripts/ebay_cards.py active -q "luka donic prizm silver" --grade "PSA 10"
python3 scripts/ebay_cards.py active -q "2018 prizm #280 silver" --grade "PSA 10"
```

Each hunt reuses the comps from the main scan, so run `active` with
`--grade` matching the bucket and compare its totals against the median
you already have.

### 5. Report

Lead with the best one or two listings and the comp median they are measured
against. For each listing give: all-in price, percent under median, format
and time left, the reason it is cheap, what to verify in the photos, and the
URL. Then the comp summary in one or two lines (count, median, trend, any
thinness). Then the hunts you ran that came up empty, in one line, so the
user knows what was covered. Keep the full table in the JSON file and point
to it.

Do not present a score as a probability or a guarantee. The user is about to
spend money; say what the number is built on.

## When eBay blocks the script

eBay serves a "Pardon Our Interruption" page to scripts it dislikes, and some
networks block it outright. The script says so on stderr. Two ways through:

1. Ask the user to open the search in their browser, save the page (Ctrl+S,
   "Webpage, complete" or "HTML only"), and pass it in:
   `scan -q "<card>" --sold-file sold.html --active-file active.html`.
   The script prints the exact URLs it would have fetched, so give the user
   those. The sold URL has `LH_Sold=1&LH_Complete=1` in it.
2. Set `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET` for live listings through
   the API. Sold prices still need option 1.

If the script returns zero results on a query that should have some, eBay may
have changed its page markup. Run with `--dump-html DIR`, then `parse` the
saved file. The parser keys on class names containing `s-item` or `s-card`
and `__title`/`__price`; adjust `_ResultParser` and `parse_search_html` if
those changed.
