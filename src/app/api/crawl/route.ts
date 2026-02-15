import { NextResponse } from "next/server";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Concert = {
  title: string | null;
  date: string | null;
  venue: string | null;
  sourceUrl: string;
  crawledAt: string;
};

const TARGET_URL = "https://www.olympicpark.kspo.or.kr/reserve/concert";

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

    const concerts = await page.evaluate((url) => {
      const rows =
        document.querySelectorAll(".concert-item").length > 0
          ? document.querySelectorAll(".concert-item")
          : document.querySelectorAll("li, tr, .item, .list-item");

      const now = new Date().toISOString();

      const readText = (node: Element | null): string | null => {
        const raw = node?.textContent?.replace(/\s+/g, " ").trim() ?? "";
        return raw.length > 0 ? raw : null;
      };

      return Array.from(rows)
        .map((row) => ({
          title:
            readText(row.querySelector(".title")) ??
            readText(row.querySelector("h3, h4, strong, .subject")),
          date:
            readText(row.querySelector(".date")) ??
            readText(row.querySelector(".period, .day, time")),
          venue:
            readText(row.querySelector(".venue")) ??
            readText(row.querySelector(".place, .hall")),
          sourceUrl: url,
          crawledAt: now,
        }))
        .filter((item) => item.title || item.date || item.venue);
    }, TARGET_URL);

    const sanitized: Concert[] = concerts.map((item) => ({
      title: normalizeText(item.title),
      date: normalizeText(item.date),
      venue: normalizeText(item.venue),
      sourceUrl: item.sourceUrl,
      crawledAt: item.crawledAt,
    }));

    return NextResponse.json({
      ok: true,
      count: sanitized.length,
      data: sanitized,
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
