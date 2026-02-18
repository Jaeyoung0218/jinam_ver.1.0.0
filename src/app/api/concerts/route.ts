import { fetchPerformances } from "@/lib/performances/repository";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const venue = searchParams.get("venue");
  const sort = searchParams.get("sort") ?? "date_asc";

  const performances = await fetchPerformances();
  let filtered = performances.filter((item) => item.status !== "finished");

  if (date) {
    filtered = filtered.filter((item) => item.start_date === date);
  }

  if (venue) {
    filtered = filtered.filter((item) => item.venue?.slug === venue);
  }

  filtered.sort((a, b) =>
    sort === "date_desc" ? b.start_date.localeCompare(a.start_date) : a.start_date.localeCompare(b.start_date),
  );

  return NextResponse.json({
    count: filtered.length,
    data: filtered,
  });
}
