# Card attributes that move price

What to pin down before pulling comps, and what sellers commonly omit. The
numbers are rough multiples for a typical modern rookie; they vary by player
and era, but the direction and order of magnitude hold.

## Grade

| Bucket | Typical multiple of raw | Notes |
|---|---|---|
| PSA 10 | 3x to 8x | The liquid standard. Most comps. |
| BGS 9.5 | 2x to 5x | Usually a bit under PSA 10. BGS 10 "Pristine" and "Black Label" are far above PSA 10. |
| SGC 10 | 1.5x to 3x | Growing acceptance; still a discount to PSA. SGC 9.5 is not PSA 9.5. |
| PSA 9 | 1x to 2x | Often close to a clean raw for modern cards. |
| CGC/CSG 10, HGA, TAG, ISA, GMA, BCCG | raw to 1.5x | The market treats most of these near raw. A "10" from one of these is not a comp for a PSA 10. |
| Raw | 1x | Condition unknown; price in the chance it grades well. |

The script buckets by grader plus number. Never mix buckets when computing
comps. When a user asks "what's it worth" with no grade, show the by-grade
table from `comps` and let them pick.

## Parallels and numbering (Panini, the modern default)

Prizm family, roughly from least to most valuable:

- Base, then Silver (the key "chase" parallel, often 5x to 10x base)
- Colored non-numbered: Red/White/Blue, Green, Hyper, Ice, Pink, Blue Ice, Red Ice (these vary a lot; retail-only ones are cheaper)
- Numbered: /299, /199, /149, /99 (Blue, Red, Orange), /75, /49, /25 (Mojo, Gold Wave, Purple), /10 (Gold), /8, /5 (Green Shimmer), /1 (Black 1/1)
- Case hits and inserts: Color Blast, Kaboom (Absolute/Crown Royale), Downtown (Donruss/Optic), Manga, Instant Impact. These are their own markets.

Optic: base, Holo (the Silver equivalent), then colors by print run. Select has
three tiers (Concourse, Premier, Courtside) and Courtside base often beats a
Concourse color. Mosaic: base, Silver/"Mosaic", then colors with Reactive and
Genesis at the top.

Older eras: Topps Chrome (2003-2009) with Refractor, X-Fractor, Gold Refractor
/99, Superfractor 1/1. Fleer, Skybox, Upper Deck, Hoops from the 1980s and
1990s where inserts (Fleer Metal Universe Precious Metal Gems, Skybox E-X2001
Credentials, Flair Showcase Legacy) carry the value and base is cheap.

Sellers omit the parallel name constantly. "Luka Prizm RC" with a photo of a
silver is a classic buried listing. Sellers also upgrade by mistake:
"Silver" when it is base, "Holo" when it is a Hyper. Always confirm in the
photo: Silver Prizm has a rainbow sheen; base has none. Numbered cards show
the serial on the front or back; a "Gold /10" title with no serial visible in
the photos is not a Gold.

## Autographs and memorabilia

- On-card auto beats sticker auto, usually 1.5x to 3x.
- RPA (rookie patch auto) from National Treasures, Flawless, Immaculate is
  the top of the hobby. Patch quality (multi-color, logo, tag) moves price
  more than the serial number.
- "Facsimile auto" (printed signature) is not an autograph. "Signed" with no
  COA from the manufacturer means an aftermarket signature; those sell for a
  fraction and sit in a different bucket.

## Rookie year reference (modern, flagship Prizm year)

| Player | Rookie set year | Prizm base card number |
|---|---|---|
| Luka Doncic | 2018-19 | #280 |
| Trae Young | 2018-19 | #78 |
| Ja Morant | 2019-20 | #249 |
| Zion Williamson | 2019-20 | #248 |
| Anthony Edwards | 2020-21 | #258 |
| LaMelo Ball | 2020-21 | #278 |
| Tyrese Haliburton | 2020-21 | #259 |
| Cade Cunningham | 2021-22 | #282 |
| Paolo Banchero | 2022-23 | #249 |
| Victor Wembanyama | 2023-24 | #136 |
| Chet Holmgren | 2022-23 | #250 |
| Jayson Tatum | 2017-18 | #16 |
| Shai Gilgeous-Alexander | 2018-19 | #184 |
| Nikola Jokic | 2015-16 (Hoops #262, no Prizm RC) | n/a |
| Giannis Antetokounmpo | 2013-14 (Prizm #290) | #290 |
| Stephen Curry | 2009-10 (Topps Chrome #101, Topps #321) | n/a |
| LeBron James | 2003-04 (Topps Chrome #111, Topps #221) | n/a |

Card numbers let you search without the player's name, which finds listings
that titled the card by number alone, and they let you confirm a photo.

## Red flags in titles

- "reprint", "RP", "facsimile", "custom", "novelty", "ACEO", "proxy":
  excluded from comps automatically.
- "lot", "bundle", "you pick": excluded. A lot can be a deal when the sum of
  its parts beats the price, but that is a separate manual check.
- "as is", "crease", "OC", "surface", "dinged": the script halves the score.
- "PSA 10?" or "gem mint?" with a question mark on a raw card: a raw card,
  priced like a slab.
- "Gem mint" or "mint" on a raw card: no information.
- Grades from graders not in the table above: treat as raw.
