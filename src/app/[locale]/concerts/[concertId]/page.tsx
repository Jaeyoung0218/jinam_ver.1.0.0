import BottomNav from "@/components/ui/bottom-nav";
import { fetchPerformanceById } from "@/lib/performances/repository";
import { getDDay } from "@/lib/utils/dday";
import { CalendarDays, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW"; concertId: string }>;
};

function formatDateByLocale(date: string, locale: "ko" | "zh-TW") {
  const d = new Date(`${date}T00:00:00+09:00`);
  return d.toLocaleDateString(locale === "ko" ? "ko-KR" : "zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

export default async function ConcertDetailPage({ params }: Props) {
  const { locale, concertId } = await params;
  const t = await getTranslations("ConcertDetail");
  const concert = await fetchPerformanceById(concertId);
  if (!concert) notFound();

  const title = locale === "ko" ? concert.title_ko : concert.title_zh_tw ?? concert.title_ko;
  const venue = locale === "ko" ? concert.venue?.name_ko : concert.venue?.name_zh_tw;
  const dday = getDDay(concert.start_date);
  const globalTicket = concert.ticket_links?.find((item) => item.is_global)?.url;
  const fallbackTicket = concert.ticket_links?.[0]?.url;
  const ticketUrl = globalTicket ?? fallbackTicket;

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[#F5F7FB] px-4 pb-28 pt-5">
      <article className="overflow-hidden rounded-2xl border border-[#E2E8F5] bg-white shadow-sm">
        <div className="h-72 w-full bg-[#E9EEF8]">
          {concert.poster_url ? (
            <Image src={concert.poster_url} alt={title} width={1200} height={720} className="h-full w-full object-cover" />
          ) : null}
        </div>

        <div className="p-5">
          <div className="mb-2 inline-flex rounded-full bg-[#FF2E63]/10 px-2.5 py-1 text-xs font-semibold text-[#FF2E63]">{dday <= 0 ? t("dday") : `D-${dday}`}</div>
          <h1 className="text-2xl font-semibold text-[#1D2742]">{title}</h1>
          <p className="text-cjk-body mt-1 text-sm font-normal text-[#4B587C]">{concert.artist_name ?? "-"}</p>

          <div className="text-cjk-body mt-4 space-y-2 text-sm font-normal text-[#4B587C]">
            <p className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDateByLocale(concert.start_date, locale)}
            </p>
            <p className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {venue ?? "-"}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ticketUrl ? (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
              >
                {t("ticketCta")}
              </a>
            ) : (
              <span className="inline-flex items-center justify-center rounded-lg bg-[#EEF1F8] px-3 py-2 text-sm font-semibold text-[#4B587C]">
                {t("comingSoon")}
              </span>
            )}

            <a
              href={`/${locale}/services/luggage?concertId=${concert.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900"
            >
              {t("luggageCta")}
            </a>
          </div>
        </div>
      </article>

      <BottomNav active="concerts" />
    </main>
  );
}
