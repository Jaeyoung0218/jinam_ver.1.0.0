import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers.get("x-cron-token");
  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ code: "NO_SUPABASE_CONFIG" }, { status: 400 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffDate = cutoff.toISOString().slice(0, 10);

  const { error } = await client
    .from("performances")
    .update({ status: "archived" })
    .lt("end_date", cutoffDate)
    .neq("status", "archived");

  if (error) {
    return NextResponse.json({ code: "ARCHIVE_UPDATE_FAILED", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, archivedBefore: cutoffDate });
}
