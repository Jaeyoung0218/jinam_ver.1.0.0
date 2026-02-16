import concerts from "@/data/concerts.json";
import type { Concert } from "@/types/concert";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(concerts as Concert[]);
}
