import seed from "@/data/performances.seed.json";
import { getKstNow } from "@/lib/utils/dday";
import type { Performance } from "@/types/performance";
import { existsSync, readdirSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function deriveStatus(startDate: string, endDate: string | null): Performance["status"] {
  const now = getKstNow();
  const start = new Date(`${startDate}T00:00:00+09:00`);
  const end = new Date(`${(endDate ?? startDate)}T23:59:59+09:00`);

  if (now < start) return "scheduled";
  if (now > end) return "finished";
  return "ongoing";
}

export async function fetchPerformances() {
  const mappedFromCrawl = mapCrawlJsonToPerformances();
  if (mappedFromCrawl.length > 0) {
    return mappedFromCrawl;
  }

  return (seed as Performance[]).map((item) => ({
    ...item,
    status: deriveStatus(item.start_date, item.end_date),
  }));
}

export async function fetchPerformanceById(id: string) {
  const all = await fetchPerformances();
  return all.find((item) => item.id === id) ?? null;
}

type CrawlItem = {
  id?: string;
  name: string;
  place?: string;
  location?: string;
  date?: string[];
  time?: string[];
  schedule?: Array<{ date: string; time?: string }>;
  link?: string;
};

type CrawlPayload = {
  concerts?: CrawlItem[];
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapVenue(rawPlace: string): NonNullable<Performance["venue"]> {
  const place = rawPlace.trim();
  if (place === "KSPO DOME") {
    return {
      id: "venue-kspo",
      slug: "kspo-dome",
      name_ko: "KSPO DOME",
      name_zh_tw: "KSPO DOME",
    };
  }
  if (place === "SK핸드볼경기장" || place.includes("핸드볼")) {
    return {
      id: "venue-handball",
      slug: "handball",
      name_ko: "SK핸드볼경기장",
      name_zh_tw: "手球館",
    };
  }
  if (place === "올림픽홀") {
    return {
      id: "venue-olympic",
      slug: "olympic-hall",
      name_ko: "올림픽홀",
      name_zh_tw: "奧林匹克廳",
    };
  }
  return {
    id: "venue-kspo",
    slug: "kspo-dome",
    name_ko: place,
    name_zh_tw: place,
  };
}

function mapCrawlJsonToPerformances(): Performance[] {
  const payload = loadCrawlPayload();
  const concerts = Array.isArray(payload.concerts) ? payload.concerts : [];
  if (concerts.length === 0) return [];

  const list = concerts
    .map((concert, index): Performance | null => {
      const { dates, timeLabel } = extractSchedule(concert);
      if (dates.length === 0) return null;

      const sortedDates = [...dates].sort((a, b) => a.localeCompare(b));
      const startDate = sortedDates[0];
      const endDate = sortedDates[sortedDates.length - 1];
      const venue = mapVenue(concert.place ?? concert.location ?? "");
      const baseId = concert.id?.trim();
      const id = baseId && baseId.length > 0 ? baseId : `${toSlug(concert.name)}-${startDate}-${index + 1}`;
      const ticketUrl = concert.link?.trim();
      const posterUrl = hasThumbnailById(id) ? `/api/thumbnails/${encodeURIComponent(id)}` : null;

      return {
        id,
        title_ko: concert.name,
        title_zh_tw: null,
        artist_name: concert.name,
        start_date: startDate,
        end_date: endDate,
        start_time: timeLabel,
        venue_id: venue.id,
        poster_url: posterUrl,
        status: deriveStatus(startDate, endDate),
        venue,
        ticket_links: ticketUrl
          ? [
              {
                id: `ticket-${id}`,
                provider: "YES24",
                url: ticketUrl,
                is_global: true,
              },
            ]
          : [],
      };
    })
    .filter((item): item is Performance => item !== null)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  return list;
}

function normalizeTimeLabel(value: string[] | undefined): string | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const unique = Array.from(
    new Set(
      value
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    ),
  );
  if (unique.length === 0) return null;
  return unique.join(" / ");
}

function extractSchedule(concert: CrawlItem): { dates: string[]; timeLabel: string | null } {
  if (Array.isArray(concert.schedule) && concert.schedule.length > 0) {
    const dates = concert.schedule
      .map((item) => item?.date?.trim() ?? "")
      .filter((value) => value.length > 0);
    const times = concert.schedule
      .map((item) => item?.time?.trim() ?? "")
      .filter((value) => value.length > 0);
    return {
      dates,
      timeLabel: normalizeTimeLabel(times),
    };
  }

  const dates = Array.isArray(concert.date)
    ? concert.date.filter((value) => typeof value === "string" && value.length > 0)
    : [];

  return {
    dates,
    timeLabel: normalizeTimeLabel(concert.time),
  };
}

function hasThumbnailById(id: string): boolean {
  const dir = join(process.cwd(), "crawler", "concert_thumbnails");
  if (!existsSync(dir)) return false;
  const lowered = id.toLowerCase();
  const files = readdirSync(dir);
  const exact = files.some((file) => {
    const dot = file.lastIndexOf(".");
    if (dot <= 0) return false;
    const base = file.slice(0, dot).toLowerCase();
    return base === lowered;
  });
  if (exact) return true;

  return files.some((file) => {
    const dot = file.lastIndexOf(".");
    if (dot <= 0) return false;
    const base = file.slice(0, dot).toLowerCase();
    return base.startsWith(lowered) || lowered.startsWith(base) || base.includes(lowered) || lowered.includes(base);
  });
}

function loadCrawlPayload(): CrawlPayload {
  const filePath = join(process.cwd(), "src", "data", "kspo_concert_26_Q1.json");
  if (!existsSync(filePath)) return {};

  const raw = readFileSync(filePath, "utf-8");
  const withoutComments = raw
    .split(/\r?\n/)
    .map((line) => (line.trimStart().startsWith("//") ? "" : line))
    .join("\n");

  const extracted = extractFirstJsonObject(withoutComments);
  if (!extracted) return {};

  try {
    return JSON.parse(extracted) as CrawlPayload;
  } catch {
    return {};
  }
}

function extractFirstJsonObject(input: string): string | null {
  const start = input.indexOf("{");
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < input.length; i += 1) {
    const ch = input[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return input.slice(start, i + 1);
      }
    }
  }

  return null;
}
