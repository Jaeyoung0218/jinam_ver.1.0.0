import { getConcerts } from "@/lib/concerts";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(getConcerts());
}
