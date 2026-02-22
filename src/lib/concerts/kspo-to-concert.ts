import kspoData from "@/data/kspo_concert_26_Q1.json";
import type { Concert, Venue } from "@/types/concert";

type KspoItem = {
  name: string;
  place: string;
  date: string[];
  time: string[];
  link: string;
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
  const dates = Array.isArray(item.date) ? item.date : [item.date];
  const times = Array.isArray(item.time) ? item.time : [item.time];
  const firstDate = dates[0] ?? "";
  const lastDate = dates[dates.length - 1] ?? firstDate;
  const startTime = times[0] ?? "19:00";
  const venue = toVenue(item.place);
  const posterTone = POSTER_TONES[index % POSTER_TONES.length];
  const base = `kspo-26-q1-${slug(item.name)}-${firstDate}`.replace(/--+/g, "-");
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
  const items = (kspoData as { concerts: KspoItem[] }).concerts ?? [];
  const seen = new Set<string>();
  const list: Concert[] = [];
  let index = 0;
  for (const item of items) {
    const key = `${item.name}|${item.place}|${(item.date ?? [])[0] ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(toConcert(item, index));
    index += 1;
  }
  return list;
}

/** 페이지에서 사용할 KSPO 콘서트 목록 (캐시) */
export const kspoConcerts = getKspoConcerts();
