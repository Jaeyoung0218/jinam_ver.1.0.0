import asyncio
import os
import re
from datetime import datetime, timedelta, timezone
from difflib import SequenceMatcher
from urllib.parse import quote_plus

from dotenv import load_dotenv
from openai import OpenAI
from playwright.async_api import async_playwright
from supabase import create_client

load_dotenv()

KST = timezone(timedelta(hours=9))
OLYMPIC_URL = "https://www.ksponco.or.kr/olympicpark/eventInfo/eventInfoList?mid=a20301010100"


def sanitize_title(text: str) -> str:
    return re.sub(r"[^\w\s가-힣A-Za-z0-9]", " ", text).strip()


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def build_ticket_candidates(title: str):
    q = quote_plus(title)
    return [
        {"provider": "YES24", "url": f"https://ticket.yes24.com/New/Perf?keyword={q}"},
        {"provider": "WorldNol", "url": f"https://www.worldnol.com/search?q={q}"},
    ]


def translate_to_zh_tw(client: OpenAI, text: str):
    if not client:
        return None

    response = client.responses.create(
        model="gpt-4o-mini",
        input=f"다음 공연명을 대만 번체 중국어로 번역해 주세요. 원문: {text}",
    )
    return response.output_text.strip()


def map_venue(venue_text: str):
    venue_text = venue_text.strip()
    mapping = {
        "KSPO DOME": {"slug": "kspo-dome", "name_zh_tw": "KSPO DOME"},
        "SK핸드볼경기장": {"slug": "handball", "name_zh_tw": "手球館"},
        "올림픽홀": {"slug": "olympic-hall", "name_zh_tw": "奧林匹克廳"},
    }
    return mapping.get(venue_text)


async def crawl_olympic():
    rows = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(OLYMPIC_URL, wait_until="domcontentloaded")
        await page.wait_for_selector("table, .board_list, .list")

        rows = await page.evaluate(
            """
            () => {
              const trs = Array.from(document.querySelectorAll("table tbody tr"));
              return trs.map((tr) => {
                const tds = tr.querySelectorAll("td");
                const img = tr.querySelector("img");
                return {
                  title: tds[1]?.textContent?.trim() ?? "",
                  venue: tds[2]?.textContent?.trim() ?? "",
                  date: tds[3]?.textContent?.trim() ?? "",
                  poster_url: img?.src ?? null
                };
              }).filter((x) => x.title);
            }
            """
        )
        await browser.close()

    return rows


def parse_date_range(date_text: str):
    # Example: 2026-03-21 ~ 2026-03-23
    parts = re.findall(r"\d{4}-\d{2}-\d{2}", date_text)
    if not parts:
        return None, None
    if len(parts) == 1:
        return parts[0], parts[0]
    return parts[0], parts[1]


def upsert_to_supabase(supabase, openai_client, crawled):
    for row in crawled:
        title_ko = sanitize_title(row["title"])
        start_date, end_date = parse_date_range(row["date"])
        venue_data = map_venue(row["venue"])

        if not title_ko or not start_date or not venue_data:
            continue

        title_zh = translate_to_zh_tw(openai_client, title_ko)
        ticket_candidates = build_ticket_candidates(title_ko)
        matched = [x for x in ticket_candidates if similarity(x["provider"], x["provider"]) > 0.5]

        venue = (
            supabase.table("venues")
            .select("id")
            .eq("slug", venue_data["slug"])
            .limit(1)
            .execute()
        )

        if not venue.data:
            continue

        venue_id = venue.data[0]["id"]

        perf_payload = {
            "title_ko": title_ko,
            "title_zh_tw": title_zh,
            "artist_name": title_ko,
            "start_date": start_date,
            "end_date": end_date,
            "venue_id": venue_id,
            "poster_url": row["poster_url"],
            "status": "scheduled",
        }

        upserted = (
            supabase.table("performances")
            .upsert(perf_payload, on_conflict="venue_id,start_date,end_date,title_ko")
            .execute()
        )

        if not upserted.data:
            continue

        perf_id = upserted.data[0]["id"]

        for item in matched:
            supabase.table("ticket_links").upsert(
                {
                    "performance_id": perf_id,
                    "provider": item["provider"],
                    "url": item["url"],
                    "is_global": item["provider"] == "YES24",
                },
                on_conflict="performance_id,provider",
            ).execute()


async def main():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if not supabase_url or not supabase_key:
        raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY is required")

    supabase = create_client(supabase_url, supabase_key)
    openai_client = OpenAI(api_key=openai_key) if openai_key else None

    crawled = await crawl_olympic()
    upsert_to_supabase(supabase, openai_client, crawled)
    print(f"[crawler] done: {len(crawled)} rows")


if __name__ == "__main__":
    asyncio.run(main())
