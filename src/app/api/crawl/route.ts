import { NextResponse } from "next/server";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CrawledPerformance = {
  title_ko: string;
  date: string;
  link: string;
};

const TARGET_URL = process.env.CRAWL_GLOBAL_TICKET_URL ?? "https://ticket.example.com/global";

const normalizeText = (value: string | null | undefined): string | null => {
  const text = value?.replace(/\s+/g, " ").trim() ?? "";
  return text.length > 0 ? text : null;
};

const resolveChromeExecutablePath = (): string | undefined => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const chromeRoot = join(homedir(), ".cache", "puppeteer", "chrome");
  if (!existsSync(chromeRoot)) return undefined;

  const versions = readdirSync(chromeRoot)
    .filter((name) => name.startsWith("win64-"))
    .sort((a, b) => b.localeCompare(a));

  for (const version of versions) {
    const candidate = join(chromeRoot, version, "chrome-win64", "chrome.exe");
    if (existsSync(candidate)) return candidate;
  }

  return undefined;
};

export async function GET() {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { ok: false, message: "SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 없습니다." },
        { status: 500 },
      );
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const executablePath = resolveChromeExecutablePath();
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(TARGET_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.waitForSelector("body", { timeout: 15_000 });

    const performances = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll(".event-item"));
      return rows
        .map((item) => {
          const title = item.querySelector(".title")?.textContent?.trim() ?? "";
          const date = item.querySelector(".date")?.getAttribute("data-iso")?.trim() ?? "";
          const link = item.querySelector("a")?.getAttribute("href")?.trim() ?? "";
          return {
            title_ko: title,
            date,
            link,
          };
        })
        .filter((item) => item.title_ko && item.date && item.link);
    });

    const normalized: CrawledPerformance[] = performances
      .map((item) => ({
        title_ko: normalizeText(item.title_ko) ?? "",
        date: normalizeText(item.date) ?? "",
        link: normalizeText(item.link) ?? "",
      }))
      .filter((item) => item.title_ko && item.date && item.link);

    let inserted = 0;
    let skipped = 0;
    for (const perf of normalized) {
      const { data: existing, error: selectError } = await supabase
        .from("performances")
        .select("id")
        .filter("title->>ko", "eq", perf.title_ko)
        .eq("performance_date", perf.date)
        .maybeSingle();

      if (selectError) {
        skipped += 1;
        continue;
      }

      if (existing?.id) {
        skipped += 1;
        continue;
      }

      const { error: insertError } = await supabase.from("performances").insert({
        title: { ko: perf.title_ko, "zh-TW": "" },
        performance_date: perf.date,
        ticket_link_global: perf.link,
        status: "Hold",
        source: TARGET_URL,
      });

      if (insertError) {
        skipped += 1;
        continue;
      }
      inserted += 1;
    }

    return NextResponse.json({
      ok: true,
      target: TARGET_URL,
      crawled: normalized.length,
      inserted,
      skipped,
      data: normalized,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, message: "크롤링 실패", error: message },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
