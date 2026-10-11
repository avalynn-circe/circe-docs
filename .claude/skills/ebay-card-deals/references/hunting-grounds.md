# Hunting grounds: where underpriced listings hide

A clean query ("2018 prizm luka doncic silver psa 10") returns the listings
every buyer sees, priced by sellers who checked comps. Discounts come from
listings those buyers never see, or that end when nobody is watching. Run
the comps once from the clean query, then hunt in these places and measure
each find against that median. Each entry gives the idea, the query, and the
catch.

## 1. Misspelled players

The biggest one. A seller who writes "Donic", "Wembenyama", or "Antetokumpo"
is invisible to everyone typing it right. `misspell --name` prints the
curated nicknames plus mechanical typos.

```bash
python3 scripts/ebay_cards.py misspell --name "Nikola Jokic"
python3 scripts/ebay_cards.py active -q "jokich prizm" --all-grades
```

Catch: typos cluster in listings from casual sellers, which also means worse
photos and slower shipping. Verify the card in the images.

## 2. Card number without the name

"2018 prizm #280 silver" finds listings titled by number, set, and parallel
only. Also "2018-19 panini prizm 280". `references/card-attributes.md` has the
numbers for the key rookies.

Catch: the same number exists in every year of a set. Keep the year in the
query.

## 3. The parallel without the set, or the set without the parallel

"luka doncic silver rc psa 10" (no "prizm") and "luka doncic prizm rc psa 10"
(no "silver") both surface titles that dropped a keyword. The scan output
flags listings whose titles omit your target words. Everything depends on the
photo here.

## 4. Nicknames and first names only

"wemby", "ant edwards", "sga", "greek freak", "luka rc", "joker prizm". The
misspell command includes these. Younger sellers title cards the way they
talk about them.

## 5. Auctions ending when buyers are asleep

Sort live auctions by time ending soonest, then look for ones ending between
roughly 1am and 7am Eastern on a weeknight, or during a major game. Fewer
snipers, lower hammer. Pull `active --format auction` and read the `left`
column; the script scores any auction with under a few hours left normally
and discounts ones with days left to near zero, because an early bid on a
7-day auction is not a price.

Catch: the price moves in the last 30 seconds. The listing is only a deal if
the user is there, or bids their maximum through a sniping service.

## 6. Best Offer with a stale ask

Sellers who listed months ago with OBO and never relisted. Look for
`BIN+OBO` in the format column at or slightly under median. A 15% offer on a
listing already 10% under is a 25% deal, and the script adds a small bonus
for OBO. A seller with many OBO listings and high feedback is running a
business and will counter; a seller with one listing will often accept.

## 7. Wrong category or wrong sport

Cards listed under "Collectibles" or "Everything Else" instead of Sports
Trading Card Singles, or under Football. Search without `_sacat` by editing
the URL: the script pins the category by default, so for this hunt use the
eBay site directly or dump the HTML of an all-categories search and `parse`
it.

## 8. Estate and sell-off language

"collection", "estate", "found", "inherited", "cleaning out", "dad's",
"grandpa's", "moving sale", plus the player name. These sellers price by
feel. Many are raw cards with no sleeve in the photo, which is fine for
the price but means a grading gamble.

## 9. Less-popular graders at raw prices

An SGC 10 or BGS 9.5 of a card whose PSA 10 market is strong. `comps` shows
the by-grade table; when SGC 10 sells for raw plus a little, and the card is
clean, a crossover or a hold is the trade. Not a flip for most people, but it
is the systematic discount in graded cards.

## 10. Foreign eBay sites and currency confusion

ebay.co.uk, ebay.ca, ebay.de, ebay.com.au. Sellers price in local currency
against local demand, which for NBA cards is thinner. Replace `www.ebay.com`
with the regional domain in the URL and `parse` the saved page (the script's
money parser accepts £, €, C$, AU$ but reports the number as-is, so convert
before comparing). Add shipping and import duty before calling it a deal.

## 11. News lag

A trade, a breakout game, or an injury moves comps within days, but live
listings priced before the news sit at the old number for weeks. When the
user asks about a player in the news, compare the 30-day median to the
90-day median in the comps line: if the 30-day is well above, every
listing under the 90-day median is behind the market. The reverse is true
after an injury, when the "deals" are the new price.

## 12. Lots whose parts beat the whole

"lot" and "bundle" are excluded from comps for a reason, but a 5-card lot
with one card worth the whole price is a deal. Search `"<player> lot"` with
`--all-grades`, then price the headline card against its own comps. Manual,
slow, and the best source of raw rookies for graders.

## What to do with each find

Measure against the median from the clean query, not against the listing's
own claims. Read the photos for: the parallel's sheen or serial, centering,
corners, the slab's label and cert number (look it up on the grader's site),
and whether the card in the photo matches the title. Check the seller's
feedback count and recent negatives. Add shipping. Then decide.
