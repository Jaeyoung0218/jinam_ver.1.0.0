import { fetchPerformances } from "@/lib/performances/repository";
import { getDDay } from "@/lib/utils/dday";
import type { GroupedPerformances, Performance } from "@/types/performance";
import { NextResponse } from "next/server";

function groupByVenue(items: Performance[]): GroupedPerformances {
  const map = new Map<string, GroupedPerformances[number]>();

  for (const item of items) {
    if (!item.venue) continue;

    if (!map.has(item.venue.id)) {
      map.set(item.venue.id, {
        venue: item.venue,
        items: [],
      });
    }

    map.get(item.venue.id)!.items.push({
      ...item,
      d_day: getDDay(item.start_date),
    });
  }

  return [...map.values()];
}

export async function GET() {
  try {
    const performances = await fetchPerformances();
    const futureOnly = performances.filter((item) => item.status !== "finished");
    const grouped = groupByVenue(futureOnly);

    return NextResponse.json({
      data: grouped,
      count: futureOnly.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: "PERF_LIST_FETCH_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
