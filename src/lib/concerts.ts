import rawConcerts from "@/data/concerts.json";
import type { Concert } from "@/types/concert";

export function getConcerts(): Concert[] {
  return rawConcerts as Concert[];
}

export function getConcertById(id: string): Concert | null {
  const found = getConcerts().find((item) => item.id === id);
  return found ?? null;
}
