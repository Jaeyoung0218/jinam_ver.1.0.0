import seed from "@/data/performances.seed.json";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getKstNow } from "@/lib/utils/dday";
import type { Performance } from "@/types/performance";

function deriveStatus(startDate: string, endDate: string | null): Performance["status"] {
  const now = getKstNow();
  const start = new Date(`${startDate}T00:00:00+09:00`);
  const end = new Date(`${(endDate ?? startDate)}T23:59:59+09:00`);

  if (now < start) return "scheduled";
  if (now > end) return "finished";
  return "ongoing";
}

export async function fetchPerformances() {
  const client = getSupabaseAdmin();

  if (!client) {
    return (seed as Performance[]).map((item) => ({
      ...item,
      status: deriveStatus(item.start_date, item.end_date),
    }));
  }

  const { data, error } = await client
    .from("performances")
    .select(
      `
      id,title_ko,title_zh_tw,artist_name,start_date,end_date,venue_id,poster_url,status,
      venue:venues(id,slug,name_ko,name_zh_tw),
      ticket_links:ticket_links(id,provider,url,is_global)
    `,
    )
    .order("start_date", { ascending: true });

  if (error || !data) {
    return (seed as Performance[]).map((item) => ({
      ...item,
      status: deriveStatus(item.start_date, item.end_date),
    }));
  }

  return (data as unknown as Array<Record<string, unknown>>).map((raw) => {
    const venueRaw = raw.venue;
    const venue = Array.isArray(venueRaw) ? venueRaw[0] : venueRaw;
    const ticketRaw = raw.ticket_links;
    const ticketLinks = Array.isArray(ticketRaw) ? ticketRaw : [];

    return {
      id: String(raw.id ?? ""),
      title_ko: String(raw.title_ko ?? ""),
      title_zh_tw: raw.title_zh_tw ? String(raw.title_zh_tw) : null,
      artist_name: raw.artist_name ? String(raw.artist_name) : null,
      start_date: String(raw.start_date ?? ""),
      end_date: raw.end_date ? String(raw.end_date) : null,
      venue_id: String(raw.venue_id ?? ""),
      poster_url: raw.poster_url ? String(raw.poster_url) : null,
      status: String(raw.status ?? "scheduled") as Performance["status"],
      venue: venue
        ? {
            id: String((venue as Record<string, unknown>).id ?? ""),
            slug: String((venue as Record<string, unknown>).slug ?? "kspo-dome") as "kspo-dome" | "handball" | "olympic-hall",
            name_ko: String((venue as Record<string, unknown>).name_ko ?? ""),
            name_zh_tw: String((venue as Record<string, unknown>).name_zh_tw ?? ""),
          }
        : undefined,
      ticket_links: ticketLinks.map((ticket) => ({
        id: String((ticket as Record<string, unknown>).id ?? ""),
        provider: String((ticket as Record<string, unknown>).provider ?? "YES24") as "YES24" | "WorldNol",
        url: String((ticket as Record<string, unknown>).url ?? ""),
        is_global: Boolean((ticket as Record<string, unknown>).is_global),
      })),
    } satisfies Performance;
  });
}

export async function fetchPerformanceById(id: string) {
  const all = await fetchPerformances();
  return all.find((item) => item.id === id) ?? null;
}
