#!/usr/bin/env python3
"""eBay basketball card deal finder. Standard library only.

Subcommands
  comps     Sold/completed listings for a card -> price statistics by grade bucket.
  active    Live listings for a card (Buy It Now, auctions, best offer).
  scan      comps + active, then rank live listings by how far under the comps they sit.
  misspell  Generate the misspellings and nicknames sellers use, for typo hunting.
  parse     Parse a saved eBay search HTML file (debugging the scraper).

Data sources, in order of preference
  1. eBay Browse API (active listings only). Needs EBAY_CLIENT_ID and EBAY_CLIENT_SECRET.
  2. eBay search HTML. No credentials. This is the only source for sold prices.

Every subcommand prints a readable table to stdout. Add --json to also write
the full record set to a file, which is what the skill's workflow consumes.
"""

from __future__ import annotations

import argparse
import base64
import html as html_mod
import json
import os
import re
import difflib
import statistics
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from typing import Iterable

EBAY_SEARCH = "https://www.ebay.com/sch/i.html"
BROWSE_SEARCH = "https://api.ebay.com/buy/browse/v1/item_summary/search"
TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token"
CARD_SINGLES_CATEGORY = "261328"  # Sports Trading Card Singles
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)
# Titles containing these are not the card you are pricing. Dropping them keeps
# the comps honest; a $3 reprint in the sold pool drags the median down and makes
# every live listing look expensive, while a 10-card lot drags it up.
JUNK_WORDS = [
    "reprint", "rp ", "facsimile", "custom", "novelty", "digital", "proxy",
    "aceo", "sticker", "promo card", "art card", "fan art", "not licensed",
    "lot of", "card lot", "bundle", "pick your", "you pick", "choose your",
    "complete your set", "break", "mystery",
]


# ---------------------------------------------------------------------------
# Card attribute normalization
# ---------------------------------------------------------------------------

GRADE_RE = re.compile(
    r"\b(PSA|BGS|SGC|CGC|CSG|HGA|TAG|ISA|GMA|BCCG)\s*-?\s*(10|9\.5|9|8\.5|8|7\.5|7|6|5)\b",
    re.I,
)
ONE_OF_ONE_RE = re.compile(r"\b(1\s*/\s*1|1 of 1|one of one|1of1)\b", re.I)
NUMBERED_RE = re.compile(r"(?:^|[\s#/])(\d{1,3})\s*/\s*(\d{1,4})\b", re.I)
SERIAL_RE = re.compile(r"(?<![\d/])/\s*(\d{1,4})\b")
YEAR_RE = re.compile(r"\b((?:19|20)\d{2})(?:\s*-\s*(\d{2,4}))?\b")
PARALLELS = [
    "silver", "gold", "black", "red", "blue", "green", "orange", "purple", "pink",
    "white sparkle", "sparkle", "hyper", "disco", "mojo", "wave", "ice", "shimmer",
    "cracked ice", "tie dye", "tie-dye", "camo", "snakeskin", "lazer", "laser",
    "nebula", "fast break", "choice", "no huddle", "flash", "scope", "kaboom",
    "downtown", "color blast", "case hit", "ssp", "sp ", "refractor", "x-fractor",
    "xfractor", "superfractor", "atomic", "pulsar", "zebra", "tiger", "galactic",
    "neon", "holo", "foil", "prizm", "optic", "select", "mosaic", "chrome",
    "sapphire", "bronze", "ruby", "emerald", "lucky envelope", "fotl", "first off the line",
]
RAW_WORDS = ["raw", "ungraded", "not graded"]


@dataclass
class Card:
    player: str = ""
    year: str = ""
    grade: str = "raw"       # e.g. "PSA 10", "BGS 9.5", "raw"
    serial: str = ""         # e.g. "/99", "1/1"
    parallels: list[str] = field(default_factory=list)
    rookie: bool = False
    auto: bool = False
    patch: bool = False


def classify_title(title: str) -> Card:
    """Pull the attributes that move price out of a listing title."""
    t = " " + title.lower().replace("’", "'") + " "
    card = Card()
    m = GRADE_RE.search(title)
    if m:
        card.grade = f"{m.group(1).upper()} {m.group(2)}"
    elif any(w in t for w in RAW_WORDS):
        card.grade = "raw"
    m = NUMBERED_RE.search(title)
    if ONE_OF_ONE_RE.search(title):
        card.serial = "1/1"
    elif m:
        card.serial = f"/{m.group(2)}"
    else:
        m = SERIAL_RE.search(title)
        if m and int(m.group(1)) <= 2500:
            card.serial = f"/{m.group(1)}"
    m = YEAR_RE.search(title)
    if m:
        card.year = m.group(1)
    card.parallels = sorted({p.strip() for p in PARALLELS if f" {p}" in t})
    card.rookie = bool(re.search(r"\b(rc|rookie)\b", t))
    card.auto = bool(re.search(r"\b(auto|autograph|signed|on-card|sticker auto)\b", t))
    card.patch = bool(re.search(r"\b(patch|jersey|relic|rpa|memorabilia)\b", t))
    return card


def grade_bucket(card: Card) -> str:
    """Comps only mean something within a grade. A PSA 10 and a raw copy of the
    same card are different markets, often by 5x or more."""
    return card.grade


def is_junk(title: str) -> bool:
    t = " " + title.lower() + " "
    return any(w in t for w in JUNK_WORDS)


# ---------------------------------------------------------------------------
# Listing model
# ---------------------------------------------------------------------------

@dataclass
class Listing:
    item_id: str
    title: str
    price: float
    shipping: float = 0.0
    currency: str = "USD"
    url: str = ""
    sold_date: str = ""          # ISO date for sold listings
    format: str = ""             # "BIN", "AUCTION", "BIN+OBO", "AUCTION+BIN"
    best_offer: bool = False
    bids: int | None = None
    time_left: str = ""          # e.g. "2h 14m" for auctions
    ends_at: str = ""            # ISO datetime when known
    seller: str = ""
    seller_feedback: int | None = None
    seller_pct: float | None = None
    condition: str = ""
    image: str = ""
    source: str = "html"
    card: dict = field(default_factory=dict)

    @property
    def total(self) -> float:
        return round(self.price + (self.shipping or 0.0), 2)


# ---------------------------------------------------------------------------
# HTTP
# ---------------------------------------------------------------------------

def http_get(url: str, headers: dict | None = None, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, **(headers or {})})
    last_err: Exception | None = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read()
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:  # noqa: PERF203
            last_err = e
            time.sleep(1.5 * (attempt + 1))
    raise SystemExit(f"GET failed after retries: {url}\n{last_err}")


def build_search_url(query: str, *, sold: bool, page: int = 1, max_price: float | None = None,
                     min_price: float | None = None, buy_format: str = "all") -> str:
    params = {
        "_nkw": query,
        "_sacat": CARD_SINGLES_CATEGORY,
        "_ipg": "240",
        "_pgn": str(page),
        "rt": "nc",
    }
    if sold:
        params["LH_Sold"] = "1"
        params["LH_Complete"] = "1"
        params["_sop"] = "13"  # most recent first
    else:
        params["_sop"] = "15"  # price + shipping lowest first
        if buy_format == "bin":
            params["LH_BIN"] = "1"
        elif buy_format == "auction":
            params["LH_Auction"] = "1"
    if max_price is not None:
        params["_udhi"] = str(max_price)
    if min_price is not None:
        params["_udlo"] = str(min_price)
    return EBAY_SEARCH + "?" + urllib.parse.urlencode(params)


# ---------------------------------------------------------------------------
# HTML parsing. eBay has shipped two result markups in recent years, the
# older "s-item" family and the newer "s-card" family. The parser keys on
# class-name substrings so either one works, and the `parse` subcommand lets
# you check a saved page when eBay changes things again.
# ---------------------------------------------------------------------------

MONEY_RE = re.compile(r"(?:(US|C|AU|EUR|GBP|£|€)\s*)?\$?\s*([\d,]+\.\d{2}|[\d,]+)")
SOLD_DATE_RE = re.compile(r"Sold\s+([A-Z][a-z]{2,8})\s+(\d{1,2}),\s*(\d{4})")
TIME_LEFT_RE = re.compile(r"(\d+)\s*([dhm])\s*(?:(\d+)\s*([hm]))?\s*(?:left)?", re.I)
BIDS_RE = re.compile(r"(\d+)\s*bids?", re.I)
ITEM_ID_RE = re.compile(r"/itm/(?:[^/]+/)?(\d{9,15})")
FEEDBACK_RE = re.compile(r"\(([\d,]+)\)\s*([\d.]+)%")


class _ResultParser(HTMLParser):
    """Collects text per result card, keyed by the class names it was found under."""

    ITEM_CLASS_HINTS = ("s-item", "s-card", "su-card-container")
    VOID = {"img", "br", "hr", "input", "meta", "link", "source", "wbr", "area",
            "base", "col", "embed", "param", "track"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.items: list[dict] = []
        self._cur: dict | None = None
        self._depth = 0
        self._item_depth = 0
        self._class_stack: list[str] = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "") or ""
        if tag in self.VOID:
            # Void elements never get an end tag, so they must not touch the depth.
            if self._cur is not None and tag == "img":
                src = a.get("src") or a.get("data-src") or ""
                if src:
                    self._cur["images"].append(src)
            return
        self._depth += 1
        self._class_stack.append(cls)
        is_item_root = tag in ("li", "div") and any(
            c in cls.split() for c in ("s-item", "s-card", "su-card-container")
        ) and self._cur is None
        if is_item_root:
            self._cur = {"texts": [], "links": [], "images": [], "classes": []}
            self._item_depth = self._depth
        if self._cur is not None:
            if tag == "a" and a.get("href"):
                self._cur["links"].append(a["href"])

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if self._cur is not None and self._depth == self._item_depth:
            self.items.append(self._cur)
            self._cur = None
        self._depth -= 1
        if self._class_stack:
            self._class_stack.pop()

    def handle_data(self, data):
        if self._cur is None:
            return
        text = " ".join(data.split())
        if not text:
            return
        ctx = " ".join(self._class_stack[-3:])
        self._cur["texts"].append((ctx, text))


def _first_text(texts, *needles) -> str:
    for ctx, text in texts:
        if any(n in ctx for n in needles):
            return text
    return ""


def _money(text: str) -> float | None:
    m = MONEY_RE.search(text.replace(" ", " "))
    if not m:
        return None
    try:
        return float(m.group(2).replace(",", ""))
    except ValueError:
        return None


def parse_search_html(raw: str, *, sold: bool) -> list[Listing]:
    parser = _ResultParser()
    parser.feed(raw)
    out: list[Listing] = []
    for it in parser.items:
        texts = it["texts"]
        all_text = " | ".join(t for _, t in texts)
        link = next((l for l in it["links"] if "/itm/" in l), "")
        m = ITEM_ID_RE.search(link)
        if not m:
            continue
        item_id = m.group(1)
        title = _first_text(texts, "__title", "title")
        title = re.sub(r"^(New Listing|Sponsored)\s*", "", title, flags=re.I).strip()
        if not title or title.lower().startswith("shop on ebay"):
            continue
        price_text = _first_text(texts, "__price", "price")
        price = _money(price_text)
        if price is None:
            continue
        ship_text = next((t for _, t in texts if re.search(r"(shipping|delivery|postage)", t, re.I)), "")
        shipping = 0.0
        if ship_text and not re.search(r"free", ship_text, re.I):
            shipping = _money(ship_text) or 0.0
        sold_date = ""
        sm = SOLD_DATE_RE.search(all_text)
        if sm:
            try:
                sold_date = datetime.strptime(f"{sm.group(1)[:3]} {sm.group(2)} {sm.group(3)}", "%b %d %Y").date().isoformat()
            except ValueError:
                sold_date = ""
        bids = None
        bm = BIDS_RE.search(all_text)
        if bm:
            bids = int(bm.group(1))
        best_offer = bool(re.search(r"best offer", all_text, re.I))
        buy_now = bool(re.search(r"buy it now", all_text, re.I))
        time_left = ""
        tl = re.search(r"\b(\d+d \d+h|\d+h \d+m|\d+m \d+s|\d+d|\d+h|\d+m)\s*(left)?\b", all_text)
        if tl and (bids is not None or "left" in all_text.lower()):
            time_left = tl.group(1)
        if bids is not None:
            fmt = "AUCTION+BIN" if buy_now else "AUCTION"
        else:
            fmt = "BIN+OBO" if best_offer else "BIN"
        cond = _first_text(texts, "subtitle", "condition")
        seller, fb, pct = "", None, None
        fm = FEEDBACK_RE.search(all_text)
        if fm:
            fb = int(fm.group(1).replace(",", ""))
            pct = float(fm.group(2))
            sm2 = re.search(r"([\w.\-*]+)\s*\(" + re.escape(fm.group(1)) + r"\)", all_text)
            if sm2:
                seller = sm2.group(1)
        lst = Listing(
            item_id=item_id, title=html_mod.unescape(title), price=price, shipping=shipping,
            url=link.split("?")[0], sold_date=sold_date, format=fmt, best_offer=best_offer,
            bids=bids, time_left=time_left, seller=seller, seller_feedback=fb, seller_pct=pct,
            condition=cond, image=it["images"][0] if it["images"] else "", source="html",
        )
        lst.card = asdict(classify_title(lst.title))
        out.append(lst)
    # eBay repeats sponsored items; keep the first copy of each id.
    seen, deduped = set(), []
    for l in out:
        if l.item_id in seen:
            continue
        seen.add(l.item_id)
        deduped.append(l)
    return deduped


def load_html_files(paths: list[str], *, sold: bool) -> list[Listing]:
    """Parse search pages saved from a browser. This is the fallback when eBay
    serves a bot-check page to scripts: the user opens the same search URL,
    saves the page, and the pipeline continues from the file."""
    out: list[Listing] = []
    for path in paths:
        with open(path, encoding="utf-8", errors="replace") as fh:
            out.extend(parse_search_html(fh.read(), sold=sold))
    return out


def fetch_html_listings(query: str, *, sold: bool, pages: int, max_price=None, min_price=None,
                        buy_format="all", dump_dir: str | None = None, delay: float = 2.0,
                        files: list[str] | None = None) -> list[Listing]:
    if files:
        return load_html_files(files, sold=sold)
    out: list[Listing] = []
    for page in range(1, pages + 1):
        url = build_search_url(query, sold=sold, page=page, max_price=max_price,
                               min_price=min_price, buy_format=buy_format)
        raw = http_get(url).decode("utf-8", "replace")
        if dump_dir:
            os.makedirs(dump_dir, exist_ok=True)
            fn = os.path.join(dump_dir, f"{'sold' if sold else 'active'}-p{page}.html")
            with open(fn, "w", encoding="utf-8") as fh:
                fh.write(raw)
        if re.search(r"(Pardon Our Interruption|captcha|access denied)", raw, re.I):
            sys.stderr.write(
                "eBay returned a bot-check page. Slow down (--delay 6), try later, or open this URL in a "
                f"browser, save the page, and pass it with --sold-file/--active-file:\n  {url}\n"
            )
            break
        batch = parse_search_html(raw, sold=sold)
        if not batch:
            if page == 1:
                sys.stderr.write(
                    "No results parsed. Either the query matched nothing or eBay changed its markup. "
                    "Re-run with --dump-html DIR and inspect the page, then try `parse` on it.\n"
                )
            break
        out.extend(batch)
        if len(batch) < 50:
            break
        if page < pages:
            time.sleep(delay)
    return out


# ---------------------------------------------------------------------------
# Browse API (active listings only)
# ---------------------------------------------------------------------------

def browse_token() -> str | None:
    cid, secret = os.environ.get("EBAY_CLIENT_ID"), os.environ.get("EBAY_CLIENT_SECRET")
    if not cid or not secret:
        return None
    auth = base64.b64encode(f"{cid}:{secret}".encode()).decode()
    body = urllib.parse.urlencode({
        "grant_type": "client_credentials",
        "scope": "https://api.ebay.com/oauth/api_scope",
    }).encode()
    req = urllib.request.Request(TOKEN_URL, data=body, headers={
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded",
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)["access_token"]


def fetch_browse_listings(query: str, token: str, *, max_price=None, min_price=None,
                          buy_format="all", limit: int = 200) -> list[Listing]:
    filters = ["priceCurrency:USD", "itemLocationCountry:US"]
    if max_price is not None or min_price is not None:
        lo = f"{min_price:.2f}" if min_price is not None else ""
        hi = f"{max_price:.2f}" if max_price is not None else ""
        filters.append(f"price:[{lo}..{hi}]")
    if buy_format == "bin":
        filters.append("buyingOptions:{FIXED_PRICE}")
    elif buy_format == "auction":
        filters.append("buyingOptions:{AUCTION}")
    params = {
        "q": query,
        "category_ids": CARD_SINGLES_CATEGORY,
        "filter": ",".join(filters),
        "limit": str(min(limit, 200)),
        "sort": "price",
    }
    url = BROWSE_SEARCH + "?" + urllib.parse.urlencode(params)
    raw = http_get(url, headers={
        "Authorization": f"Bearer {token}",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    })
    data = json.loads(raw)
    out = []
    for s in data.get("itemSummaries", []):
        price = float(s.get("price", {}).get("value", 0) or 0)
        ship = 0.0
        for so in s.get("shippingOptions", []) or []:
            c = so.get("shippingCost", {})
            if c.get("value") is not None:
                ship = float(c["value"])
                break
        opts = s.get("buyingOptions", []) or []
        bids = s.get("bidCount")
        fmt = "AUCTION" if "AUCTION" in opts else "BIN"
        if "AUCTION" in opts and "FIXED_PRICE" in opts:
            fmt = "AUCTION+BIN"
        if "BEST_OFFER" in opts:
            fmt = "BIN+OBO"
        if fmt.startswith("AUCTION") and s.get("currentBidPrice"):
            price = float(s["currentBidPrice"]["value"])
        seller = s.get("seller", {}) or {}
        ends = s.get("itemEndDate", "")
        lst = Listing(
            item_id=s.get("legacyItemId") or s.get("itemId", ""), title=s.get("title", ""),
            price=price, shipping=ship, url=s.get("itemWebUrl", ""), format=fmt,
            best_offer="BEST_OFFER" in opts, bids=bids, ends_at=ends,
            time_left=_time_left_from_iso(ends), seller=seller.get("username", ""),
            seller_feedback=seller.get("feedbackScore"),
            seller_pct=float(seller["feedbackPercentage"]) if seller.get("feedbackPercentage") else None,
            condition=s.get("condition", ""), image=(s.get("image") or {}).get("imageUrl", ""),
            source="browse_api",
        )
        lst.card = asdict(classify_title(lst.title))
        out.append(lst)
    return out


def _time_left_from_iso(ends: str) -> str:
    if not ends:
        return ""
    try:
        end = datetime.fromisoformat(ends.replace("Z", "+00:00"))
    except ValueError:
        return ""
    delta = end - datetime.now(timezone.utc)
    if delta.total_seconds() <= 0:
        return "ended"
    h, rem = divmod(int(delta.total_seconds()), 3600)
    d, h = divmod(h, 24)
    m = rem // 60
    return f"{d}d {h}h" if d else f"{h}h {m}m"


def hours_left(time_left: str) -> float | None:
    if not time_left or time_left == "ended":
        return None
    total = 0.0
    for num, unit in re.findall(r"(\d+)\s*([dhms])", time_left):
        n = int(num)
        total += {"d": 24 * n, "h": n, "m": n / 60, "s": n / 3600}[unit]
    return total


# ---------------------------------------------------------------------------
# Comps statistics
# ---------------------------------------------------------------------------

def filter_relevant(listings: Iterable[Listing], target: Card | None, *, days: int | None = None,
                    must: list[str] | None = None, must_not: list[str] | None = None) -> list[Listing]:
    """Keep listings that are the same card as `target` in the ways that matter
    for price: grade, serial numbering, auto/patch, and any required words."""
    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).date().isoformat() if days else None
    out = []
    for l in listings:
        if is_junk(l.title):
            continue
        t = l.title.lower()
        if must and not all(w.lower() in t for w in must):
            continue
        if must_not and any(w.lower() in t for w in must_not):
            continue
        if cutoff and l.sold_date and l.sold_date < cutoff:
            continue
        if target is not None:
            c = l.card
            if c.get("grade") != target.grade:
                continue
            if target.serial and c.get("serial") != target.serial:
                continue
            if c.get("auto") != target.auto or c.get("patch") != target.patch:
                continue
        out.append(l)
    return out


def trimmed(values: list[float]) -> list[float]:
    """Drop outliers by the IQR rule. Sold data has unpaid relists at the top
    and mislabeled junk at the bottom; the median survives, the mean does not."""
    if len(values) < 5:
        return sorted(values)
    v = sorted(values)
    q1, q3 = v[len(v) // 4], v[(3 * len(v)) // 4]
    med = statistics.median(v)
    iqr = q3 - q1
    # A tight cluster has a tiny IQR, and a plain 1.5x fence would then cut
    # ordinary auction results. Give the fence a floor relative to the median.
    lo = q1 - max(3 * iqr, 0.25 * med)
    hi = q3 + max(3 * iqr, 0.5 * med)
    return [x for x in v if lo <= x <= hi]


def comp_stats(sold: list[Listing]) -> dict:
    totals = [l.total for l in sold]
    kept = trimmed(totals)
    if not kept:
        return {"count": 0}
    kept_sorted = sorted(kept)
    n = len(kept_sorted)
    stats = {
        "count": n,
        "raw_count": len(totals),
        "median": round(statistics.median(kept_sorted), 2),
        "mean": round(statistics.fmean(kept_sorted), 2),
        "p25": round(kept_sorted[n // 4], 2),
        "p75": round(kept_sorted[(3 * n) // 4], 2),
        "low": round(kept_sorted[0], 2),
        "high": round(kept_sorted[-1], 2),
        "spread_pct": round(100 * (kept_sorted[(3 * n) // 4] - kept_sorted[n // 4]) / max(statistics.median(kept_sorted), 0.01), 1),
    }
    dated = sorted((l for l in sold if l.sold_date), key=lambda l: l.sold_date)
    if dated:
        stats["first_sale"] = dated[0].sold_date
        stats["last_sale"] = dated[-1].sold_date
        cut = (datetime.now(timezone.utc) - timedelta(days=30)).date().isoformat()
        recent = [l.total for l in dated if l.sold_date >= cut]
        older = [l.total for l in dated if l.sold_date < cut]
        if len(recent) >= 3 and len(older) >= 3:
            r, o = statistics.median(recent), statistics.median(older)
            stats["trend_30d_pct"] = round(100 * (r - o) / o, 1)
            stats["median_30d"] = round(r, 2)
    auction_sales = [l.total for l in sold if l.bids]
    bin_sales = [l.total for l in sold if not l.bids]
    if auction_sales and bin_sales:
        stats["median_auction"] = round(statistics.median(auction_sales), 2)
        stats["median_bin"] = round(statistics.median(bin_sales), 2)
    return stats


# ---------------------------------------------------------------------------
# Deal scoring
# ---------------------------------------------------------------------------

def misspelled_name(title: str, player: str) -> str | None:
    """Return the misspelled form of the player's surname found in the title, if
    the title does not contain the correct spelling. 'Donic' for 'Doncic'."""
    if not player:
        return None
    t = title.lower()
    words = re.findall(r"[a-z\u00c0-\u024f'\-]+", t)
    for part in player.lower().split():
        if len(part) < 4 or part in t:
            continue
        for w in words:
            if len(w) >= 4 and difflib.SequenceMatcher(None, w, part).ratio() >= 0.75:
                return w
    return None


def detect_player(query: str) -> str:
    q = query.lower()
    for full in NICKNAMES:
        last = full.split()[-1]
        if full in q or last in q:
            return full
    return ""


def score_listing(l: Listing, stats: dict, *, target_words: list[str], player: str = "") -> dict:
    """Return a score 0-100 plus the reasons. The score is an estimate of how
    much money is on the table, tempered by how sure we can be."""
    median = stats.get("median")
    reasons, cautions = [], []
    if not median:
        return {"score": 0, "discount_pct": None, "reasons": [], "cautions": ["no comps"]}
    total = l.total
    discount = 100 * (median - total) / median
    score = max(0.0, min(100.0, discount))  # 1 point per percent under median

    # Confidence: thin or wildly spread comps mean the "median" is a guess.
    n = stats.get("count", 0)
    if n < 5:
        score *= 0.6
        cautions.append(f"thin comps ({n} sales)")
    elif n < 10:
        score *= 0.85
    if stats.get("spread_pct", 0) > 60:
        score *= 0.8
        cautions.append(f"wide comp spread ({stats['spread_pct']}% IQR)")
    if stats.get("trend_30d_pct") is not None and stats["trend_30d_pct"] < -15:
        cautions.append(f"price falling ({stats['trend_30d_pct']}% last 30d); discount may be the new price")
        score *= 0.85

    # Format-specific signals.
    hl = hours_left(l.time_left)
    if l.format.startswith("AUCTION"):
        if hl is not None and hl > 12:
            # A low current bid on a 5-day auction says nothing. Most of the
            # money arrives in the last hour.
            score *= 0.35
            cautions.append(f"auction with {l.time_left} left; current bid is not the final price")
        elif hl is not None:
            reasons.append(f"auction ending in {l.time_left} with {l.bids or 0} bids at {discount:.0f}% under median")
            if hl < 1:
                score = min(100, score * 1.1)
    if l.best_offer:
        reasons.append("accepts offers; opening 10-20% below ask is normal")
        score = min(100, score + 4)
    if l.format == "BIN" and discount > 0:
        reasons.append(f"Buy It Now at {discount:.0f}% under the sold median ({money(total)} vs {money(median)})")

    # Why might it be cheap? These are the explanations buyers want to see.
    tl = l.title.lower()
    typo = misspelled_name(l.title, player)
    if typo:
        reasons.append(f"player misspelled as '{typo}'; buyers searching the correct name never see this listing")
        score = min(100, score + 6)
    missing = [w for w in target_words if w.lower() not in tl]
    if missing:
        reasons.append(f"title omits {', '.join(missing)}; weak titles get fewer eyes (verify in photos)")
    if l.seller_feedback is not None and l.seller_feedback < 25:
        cautions.append(f"new seller ({l.seller_feedback} feedback)")
        score *= 0.9
    if l.seller_pct is not None and l.seller_pct < 98:
        cautions.append(f"seller at {l.seller_pct}% positive")
        score *= 0.9
    if re.search(r"\b(as is|damaged|crease|creased|corner wear|dinged|off-center|oc\b|surface)", tl):
        cautions.append("title discloses damage")
        score *= 0.5
    if discount > 70 and n >= 5:
        cautions.append("more than 70% under: assume mislabeled, reprint, or scam until photos prove otherwise")
        score *= 0.7
    if l.shipping and l.shipping > 0.3 * max(l.price, 1):
        cautions.append(f"shipping {money(l.shipping)} is a large share of the price")

    return {
        "score": round(score, 1),
        "discount_pct": round(discount, 1),
        "vs_median": round(total - median, 2),
        "reasons": reasons,
        "cautions": cautions,
    }


# ---------------------------------------------------------------------------
# Misspellings and nicknames
# ---------------------------------------------------------------------------

NICKNAMES = {
    "luka doncic": ["luka", "doncic", "dončić", "donic", "luka donic", "luka doncik", "dončic", "doncić"],
    "victor wembanyama": ["wemby", "wembanyama", "wembenyama", "wembanyana", "wembayama", "victor wemby"],
    "giannis antetokounmpo": ["giannis", "greek freak", "antetokumpo", "antetokounmpo", "antetokoumpo", "antetekounmpo"],
    "nikola jokic": ["jokic", "jokić", "joker", "nikola jokić", "jockic", "jokich"],
    "anthony edwards": ["ant edwards", "ant-man", "antman", "anthony edward"],
    "shai gilgeous-alexander": ["sga", "shai", "gilgeous alexander", "gilgeous-alexander", "gilgous", "gilgeous"],
    "jayson tatum": ["tatum", "jason tatum", "jaysen tatum"],
    "stephen curry": ["steph curry", "steph", "stephan curry", "steven curry", "curry"],
    "lebron james": ["lebron", "labron james", "le bron", "king james", "lebron jame"],
    "michael jordan": ["jordan", "mj", "micheal jordan", "michael jordon", "air jordan"],
    "kobe bryant": ["kobe", "koby bryant", "kobe briant", "kobe bryan"],
    "ja morant": ["morant", "ja", "jamorant"],
    "zion williamson": ["zion", "zion williamsn", "zion willamson", "williamson"],
    "paolo banchero": ["paolo", "banchero", "paulo banchero", "bancherro"],
    "chet holmgren": ["chet", "holmgren", "holmgrem", "chet holmgrem"],
    "cooper flagg": ["flagg", "cooper flag", "copper flagg"],
    "jalen brunson": ["brunson", "jalen brunsen", "jaylen brunson"],
    "tyrese haliburton": ["haliburton", "halliburton", "hali", "tyrese halliburton"],
    "cade cunningham": ["cade", "cunningham", "cade cunningam"],
    "scoot henderson": ["scoot", "scoot hendersen"],
    "larry bird": ["bird", "larry byrd"],
    "magic johnson": ["magic", "earvin johnson", "ervin johnson"],
    "allen iverson": ["iverson", "ai", "alan iverson", "allen iversen"],
    "dirk nowitzki": ["dirk", "nowitzki", "nowitski", "dirk nowitski"],
    "kevin durant": ["kd", "durant", "kevin durrant"],
    "shaquille o'neal": ["shaq", "shaquille oneal", "o'neal", "shaquile oneal"],
}

SET_ALIASES = {
    "prizm": ["prism", "prizim", "prizm basketball", "panini prizm"],
    "optic": ["donruss optic", "optik", "optic basketball"],
    "select": ["panini select", "select basketball"],
    "mosaic": ["mosiac", "panini mosaic"],
    "national treasures": ["nt", "nat treasures", "national treasure"],
    "flawless": ["panini flawless"],
    "immaculate": ["imaculate", "immaculate collection"],
    "contenders": ["panini contenders", "contenders basketball"],
    "hoops": ["nba hoops", "panini hoops"],
    "topps chrome": ["chrome", "topps crome", "topps chrome basketball"],
    "bowman": ["bowman university", "bowman u", "bowman chrome"],
    "court kings": ["court king"],
    "revolution": ["panini revolution"],
    "upper deck": ["ud", "upperdeck"],
    "fleer": ["fleer basketball", "flair"],
    "skybox": ["sky box"],
}


def typo_variants(name: str) -> list[str]:
    """Mechanical misspellings: dropped letter, swapped neighbors, doubled
    consonant collapsed, common vowel confusions. Sellers who cannot spell a
    name also cannot be found by buyers who can."""
    name = name.lower().strip()
    out = set()
    words = name.split()
    for wi, w in enumerate(words):
        if len(w) < 5:
            continue
        cands = set()
        for i in range(1, len(w) - 1):
            cands.add(w[:i] + w[i + 1:])                     # drop a letter
            cands.add(w[:i] + w[i + 1] + w[i] + w[i + 2:])  # swap neighbors
        for a, b in (("ie", "ei"), ("ei", "ie"), ("c", "k"), ("k", "c"), ("ou", "u"), ("ph", "f"), ("y", "i"), ("i", "y"), ("ck", "k"), ("ll", "l"), ("nn", "n"), ("mm", "m"), ("tt", "t"), ("ss", "s")):
            if a in w:
                cands.add(w.replace(a, b, 1))
        for c in cands:
            if c != w and len(c) >= 4:
                out.add(" ".join(words[:wi] + [c] + words[wi + 1:]))
    return sorted(out)


def misspell(name: str, *, limit: int = 25) -> dict:
    key = name.lower().strip()
    known = NICKNAMES.get(key, [])
    mech = typo_variants(name)
    # Prefer the hand-curated list, then fill with mechanical variants that
    # look like plausible human errors (keep ones that still share the first
    # two letters of each word).
    plausible = [v for v in mech if all(a[:2] == b[:2] for a, b in zip(v.split(), key.split()))]
    picks = list(dict.fromkeys(known + plausible))[:limit]
    return {"name": name, "known_aliases": known, "search_terms": picks}


# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------

def money(v: float | None) -> str:
    return "-" if v is None else f"${v:,.2f}"


def print_table(rows: list[list[str]], headers: list[str]) -> None:
    widths = [len(h) for h in headers]
    for r in rows:
        for i, c in enumerate(r):
            widths[i] = min(max(widths[i], len(str(c))), 70)
    fmt = "  ".join("{:<" + str(w) + "}" for w in widths)
    print(fmt.format(*headers))
    print(fmt.format(*["-" * w for w in widths]))
    for r in rows:
        print(fmt.format(*[str(c)[:70] for c in r]))


def write_json(path: str, payload: dict) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, default=str)
    print(f"\nwrote {path}")


def target_from_args(args) -> Card:
    t = classify_title(args.query + " " + (args.target_hint or ""))
    if args.grade:
        t.grade = "raw" if args.grade.lower() == "raw" else args.grade.upper().replace("PSA10", "PSA 10")
    if args.serial:
        t.serial = args.serial if args.serial.startswith("/") or args.serial == "1/1" else "/" + args.serial
    return t


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_comps(args) -> dict:
    target = target_from_args(args)
    sold = fetch_html_listings(args.query, sold=True, pages=args.pages, dump_dir=args.dump_html, delay=args.delay,
                               files=args.sold_file)
    relevant = filter_relevant(sold, target if not args.all_grades else None, days=args.days,
                               must=args.must, must_not=args.must_not)
    stats = comp_stats(relevant)
    by_grade: dict[str, list[Listing]] = {}
    for l in filter_relevant(sold, None, days=args.days, must=args.must, must_not=args.must_not):
        by_grade.setdefault(l.card.get("grade", "raw"), []).append(l)
    print(f"Comps for: {args.query}  [grade bucket: {target.grade}{' ' + target.serial if target.serial else ''}]")
    print(f"fetched {len(sold)} sold, {len(relevant)} relevant after filters, {stats.get('count', 0)} after outlier trim\n")
    if stats.get("count"):
        for k in ("median", "mean", "p25", "p75", "low", "high", "spread_pct", "trend_30d_pct", "median_30d", "median_auction", "median_bin", "first_sale", "last_sale"):
            if k in stats:
                print(f"  {k:<16} {stats[k]}")
    print("\nBy grade bucket (all sold, trimmed):")
    rows = []
    for g, ls in sorted(by_grade.items(), key=lambda kv: -len(kv[1])):
        s = comp_stats(ls)
        rows.append([g, s.get("count", 0), money(s.get("median")), money(s.get("p25")), money(s.get("p75"))])
    print_table(rows, ["grade", "n", "median", "p25", "p75"])
    print("\nMost recent sales in bucket:")
    rows = [[l.sold_date, money(l.total), ("auction" if l.bids else "BIN"), l.title] for l in sorted(relevant, key=lambda l: l.sold_date, reverse=True)[:15]]
    print_table(rows, ["sold", "total", "fmt", "title"])
    return {"query": args.query, "target": asdict(target), "stats": stats,
            "by_grade": {g: comp_stats(ls) for g, ls in by_grade.items()},
            "sold": [asdict(l) | {"total": l.total} for l in relevant]}


def _fetch_active(args) -> tuple[list[Listing], str]:
    token = None
    if args.active_file:
        return load_html_files(args.active_file, sold=False), "html_file"
    if not args.html_only:
        try:
            token = browse_token()
        except Exception as e:  # noqa: BLE001
            sys.stderr.write(f"Browse API token failed ({e}); falling back to HTML.\n")
    if token:
        return fetch_browse_listings(args.query, token, max_price=args.max_price, min_price=args.min_price,
                                     buy_format=args.format), "browse_api"
    return fetch_html_listings(args.query, sold=False, pages=args.pages, max_price=args.max_price,
                               min_price=args.min_price, buy_format=args.format,
                               dump_dir=args.dump_html, delay=args.delay), "html"


def cmd_active(args) -> dict:
    target = target_from_args(args)
    active, source = _fetch_active(args)
    relevant = filter_relevant(active, target if not args.all_grades else None, must=args.must, must_not=args.must_not)
    print(f"Active listings for: {args.query}  [{source}] {len(active)} fetched, {len(relevant)} relevant\n")
    rows = [[money(l.total), l.format, l.time_left or "", l.card.get("grade"), l.title, l.url] for l in sorted(relevant, key=lambda l: l.total)[:40]]
    print_table(rows, ["total", "format", "left", "grade", "title", "url"])
    return {"query": args.query, "source": source, "target": asdict(target),
            "active": [asdict(l) | {"total": l.total} for l in relevant]}


def cmd_scan(args) -> dict:
    target = target_from_args(args)
    sold = fetch_html_listings(args.query, sold=True, pages=args.pages, dump_dir=args.dump_html, delay=args.delay,
                               files=args.sold_file)
    comps = filter_relevant(sold, target, days=args.days, must=args.must, must_not=args.must_not)
    stats = comp_stats(comps)
    if not args.sold_file and not args.active_file:
        time.sleep(args.delay)
    active, source = _fetch_active(args)
    candidates = filter_relevant(active, target, must=args.must, must_not=args.must_not)
    target_words = [w for w in (args.must or [])] + [p for p in target.parallels] + ([target.serial] if target.serial else [])
    player = args.player or detect_player(args.query)
    scored = []
    for l in candidates:
        s = score_listing(l, stats, target_words=target_words, player=player)
        scored.append((s, l))
    scored.sort(key=lambda sl: -sl[0]["score"])
    print(f"Scan: {args.query}  [bucket {target.grade}{' ' + target.serial if target.serial else ''}]")
    print(f"comps: n={stats.get('count', 0)} median={money(stats.get('median'))} p25={money(stats.get('p25'))} "
          f"p75={money(stats.get('p75'))} trend30d={stats.get('trend_30d_pct', 'n/a')}%  |  active: {len(candidates)} ({source})\n")
    rows = []
    for s, l in scored[: args.top]:
        d = s["discount_pct"]
        vs = "-" if d is None else (f"{d:.0f}% under" if d >= 0 else f"{-d:.0f}% over")
        rows.append([s["score"], money(l.total), vs, l.format, l.time_left, l.title,
                     "; ".join(s["reasons"]) or "", "; ".join(s["cautions"]) or "", l.url])
    print_table(rows, ["score", "total", "vs median", "format", "left", "title", "why", "cautions", "url"])
    return {"query": args.query, "target": asdict(target), "comp_stats": stats, "source": source,
            "comps": [asdict(l) | {"total": l.total} for l in comps],
            "deals": [asdict(l) | {"total": l.total, "scoring": s} for s, l in scored]}


def cmd_misspell(args) -> dict:
    res = misspell(args.name, limit=args.limit)
    sets = {}
    if args.set:
        sets = {args.set: SET_ALIASES.get(args.set.lower(), [])}
    print(f"Search terms for {args.name}:")
    for t in res["search_terms"]:
        print(f"  {t}")
    if sets:
        print(f"\nSet aliases for {args.set}: {', '.join(next(iter(sets.values())) or ['(none known)'])}")
    res["set_aliases"] = sets
    return res


def cmd_parse(args) -> dict:
    with open(args.file, encoding="utf-8", errors="replace") as fh:
        raw = fh.read()
    listings = parse_search_html(raw, sold=args.sold)
    print(f"parsed {len(listings)} listings from {args.file}")
    rows = [[l.item_id, money(l.total), l.format, l.sold_date, l.time_left, l.card.get("grade"), l.title] for l in listings[:50]]
    print_table(rows, ["item", "total", "fmt", "sold", "left", "grade", "title"])
    return {"file": args.file, "listings": [asdict(l) | {"total": l.total} for l in listings]}


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    def common(sp, *, active=False, sold=False):
        sp.add_argument("--query", "-q", required=True, help="eBay search text, e.g. '2018 prizm luka doncic silver psa 10'")
        sp.add_argument("--grade", help="Force the comp bucket: 'PSA 10', 'BGS 9.5', 'raw'. Default: parsed from --query.")
        sp.add_argument("--serial", help="Force serial numbering, e.g. 99 or /99 or 1/1")
        sp.add_argument("--target-hint", help="Extra words that describe the target card but should not go in the search")
        sp.add_argument("--player", help="Full player name, for misspelling detection. Default: guessed from --query.")
        sp.add_argument("--must", nargs="*", help="Words a title must contain (case-insensitive)")
        sp.add_argument("--must-not", nargs="*", help="Words that disqualify a title")
        sp.add_argument("--all-grades", action="store_true", help="Do not bucket by grade")
        sp.add_argument("--pages", type=int, default=1, help="HTML pages to fetch per query (240 results each)")
        sp.add_argument("--delay", type=float, default=2.0, help="Seconds between HTML page fetches")
        sp.add_argument("--dump-html", metavar="DIR", help="Save fetched pages here for debugging")
        sp.add_argument("--json", metavar="FILE", help="Write full results as JSON")
        if sold:
            sp.add_argument("--days", type=int, default=90, help="Only count sales within this many days")
            sp.add_argument("--sold-file", nargs="*", metavar="HTML", help="Parse saved sold-search pages instead of fetching")
        if active:
            sp.add_argument("--active-file", nargs="*", metavar="HTML", help="Parse saved live-search pages instead of fetching")
            sp.add_argument("--max-price", type=float)
            sp.add_argument("--min-price", type=float)
            sp.add_argument("--format", choices=["all", "bin", "auction"], default="all")
            sp.add_argument("--html-only", action="store_true", help="Skip the Browse API even if credentials are set")
            sp.add_argument("--top", type=int, default=25, help="Rows to print")

    sp = sub.add_parser("comps", help="sold-price statistics")
    common(sp, sold=True)
    sp.set_defaults(func=cmd_comps)
    sp = sub.add_parser("active", help="live listings")
    common(sp, active=True)
    sp.set_defaults(func=cmd_active)
    sp = sub.add_parser("scan", help="comps + live listings, ranked by deal score")
    common(sp, active=True, sold=True)
    sp.set_defaults(func=cmd_scan)
    sp = sub.add_parser("misspell", help="misspellings and nicknames to search")
    sp.add_argument("--name", required=True)
    sp.add_argument("--set", help="Also print aliases for a set name, e.g. prizm")
    sp.add_argument("--limit", type=int, default=25)
    sp.add_argument("--json", metavar="FILE")
    sp.set_defaults(func=cmd_misspell)
    sp = sub.add_parser("parse", help="parse a saved search page")
    sp.add_argument("file")
    sp.add_argument("--sold", action="store_true")
    sp.add_argument("--json", metavar="FILE")
    sp.set_defaults(func=cmd_parse)

    args = p.parse_args(argv)
    result = args.func(args)
    if getattr(args, "json", None):
        write_json(args.json, result)


if __name__ == "__main__":
    main()
