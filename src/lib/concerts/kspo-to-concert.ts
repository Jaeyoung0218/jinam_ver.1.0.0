import type { Concert, Venue } from "@/types/concert";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type KspoItem = {
  id?: string;
  name: string;
  place?: string;
  location?: string;
  date?: string[];
  time?: string[];
  schedule?: Array<{ date: string; time?: string }>;
  link?: string;
};

const PLACE_TO_VENUE: Record<string, Venue> = {
  "KSPO DOME": "KSPO Dome",
  올림픽홀: "Olympic Hall",
  "SK핸드볼경기장": "Handball",
  핸드볼: "Handball",
};

const POSTER_TONES: Concert["posterTone"][] = [
  "pink",
  "violet",
  "sky",
  "amber",
  "emerald",
  "indigo",
];

const DEFAULT_STATE: Concert["state"] = {
  goodsStatus: "-",
  crowdLevel: "Normal",
  note: "공연 상세는 링크에서 확인하세요.",
  updatedAt: new Date().toISOString(),
};

const DEFAULT_MINI_GUIDE: Concert["miniGuide"] = {
  entryTip: "신분증과 모바일 티켓을 준비하세요.",
  lastTrainTip: "막차 시간을 미리 확인하세요.",
  transportTip: "올림픽공원역 3번 출구에서 가깝습니다.",
  noticeTip: "공연장별 안내에 따라 주차·입장해 주세요.",
};

function toVenue(place: string): Venue {
  const trimmed = (place || "").trim();
  return PLACE_TO_VENUE[trimmed] ?? "KSPO Dome";
}

function slug(str: string): string {
  return str
    .replace(/\s+/g, "-")
    .replace(/[^\w가-힣\-]/g, "")
    .toLowerCase()
    .slice(0, 30);
}

function toConcert(item: KspoItem, index: number): Concert {
  const normalized = normalizeSchedule(item);
  const dates = normalized.dates;
  const times = normalized.times;
  const firstDate = dates[0] ?? "";
  const lastDate = dates[dates.length - 1] ?? firstDate;
  const startTime = times[0] ?? "19:00";
  const venue = toVenue(item.place ?? item.location ?? "");
  const posterTone = POSTER_TONES[index % POSTER_TONES.length];
  const base = item.id?.trim() || `kspo-26-q1-${slug(item.name)}-${firstDate}`.replace(/--+/g, "-");
  const id = base || `kspo-26-q1-${index}`;

  return {
    id,
    artist: item.name,
    venue,
    date: firstDate,
    endDate: lastDate !== firstDate ? lastDate : undefined,
    startTime,
    ticketUrl: item.link || "#",
    lineOpenChatUrl: "https://line.me/ti/g/jinam-kspo",
    koreanAddress: "서울특별시 송파구 올림픽로 424",
    posterTone,
    state: DEFAULT_STATE,
    miniGuide: DEFAULT_MINI_GUIDE,
  };
}

/** KSPO 26 Q1 JSON을 Concert[]로 변환 (중복 제거) */
export function getKspoConcerts(): Concert[] {
  const items = loadKspoConcertItems();
  const seen = new Set<string>();
  const list: Concert[] = [];
  let index = 0;
  for (const item of items) {
    const firstDate = normalizeSchedule(item).dates[0] ?? "";
    const key = `${item.name}|${item.place ?? item.location ?? ""}|${firstDate}`;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(toConcert(item, index));
    index += 1;
  }
  return list;
}

/** 페이지에서 사용할 KSPO 콘서트 목록 (캐시) */
export const kspoConcerts = getKspoConcerts();

function normalizeSchedule(item: KspoItem): { dates: string[]; times: string[] } {
  if (Array.isArray(item.schedule) && item.schedule.length > 0) {
    return {
      dates: item.schedule.map((s) => s.date).filter(Boolean),
      times: item.schedule.map((s) => s.time ?? "").filter(Boolean),
    };
  }
  return {
    dates: Array.isArray(item.date) ? item.date.filter(Boolean) : [],
    times: Array.isArray(item.time) ? item.time.filter(Boolean) : [],
  };
}

function loadKspoConcertItems(): KspoItem[] {
  const path = join(process.cwd(), "src", "data", "kspo_concert_26_Q1.json");
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf-8");
  const cleaned = raw
    .split(/\r?\n/)
    .map((line) => (line.trimStart().startsWith("//") ? "" : line))
    .join("\n");
  const first = extractFirstJsonObject(cleaned);
  if (!first) return [];
  try {
    const parsed = JSON.parse(first) as { concerts?: KspoItem[] };
    return Array.isArray(parsed.concerts) ? parsed.concerts : [];
  } catch {
    return [];
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
      if (depth === 0) return input.slice(start, i + 1);
    }
  }
  return null;
}
