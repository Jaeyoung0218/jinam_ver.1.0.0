import { Link } from "@/i18n/navigation";
import BottomNav from "@/components/ui/bottom-nav";
import { fetchPerformances } from "@/lib/performances/repository";
import { getDDay } from "@/lib/utils/dday";
import type { Performance } from "@/types/performance";
import { CalendarDays, Globe, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" }>;
};

function formatDateByLocale(date: string, locale: "ko" | "zh-TW") {
  const d = new Date(`${date}T00:00:00+09:00`);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return locale === "ko" ? `${y}.${m}.${day}` : `${y}/${m}/${day}`;
}

export default async function LocalizedDashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Dashboard");
  const tv = await getTranslations("Venues");
  const performances = await fetchPerformances();

  const active = performances.filter((item) => item.status !== "finished");
  const venueFiltered = {
    all: active,
    "kspo-dome": active.filter((item) => item.venue?.slug === "kspo-dome"),
    handball: active.filter((item) => item.venue?.slug === "handball"),
    "olympic-hall": active.filter((item) => item.venue?.slug === "olympic-hall"),
  } as const;

  const cards = venueFiltered.all.sort((a, b) => a.start_date.localeCompare(b.start_date));

  return (
    <main className="mx-auto min-h-screen max-w-[760px] bg-[#F5F7FB] px-4 pb-28 pt-5">
      <header className="mb-4 rounded-2xl border border-[#E2E8F5] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#4B587C]">Jinam Admin-ready</p>
            <h1 className="text-xl font-extrabold text-[#1D2742]">{t("title")}</h1>
            <p className="text-xs text-[#6E7B9A]">{t("subtitle")}</p>
          </div>
          <Globe className="h-5 w-5 text-[#1D2742]" />
        </div>

        <div className="flex gap-2">
          <Link href="/" locale="ko" className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === "ko" ? "bg-[#1D2742] text-white" : "border border-[#DCE3F2] bg-white text-[#1D2742]"}`}>
            KO
          </Link>
          <Link href="/" locale="zh-TW" className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === "zh-TW" ? "bg-[#1D2742] text-white" : "border border-[#DCE3F2] bg-white text-[#1D2742]"}`}>
            ZH-TW
          </Link>
          <Link href="/admin" locale={locale} className="ml-auto rounded-full border border-[#DCE3F2] bg-white px-3 py-1 text-xs font-semibold text-[#1D2742]">
            {t("admin")}
          </Link>
        </div>
      </header>

      <section className="mb-4 rounded-2xl border border-[#E2E8F5] bg-white p-3">
        <p className="mb-2 text-xs font-semibold text-[#4B587C]">{t("filterLabel")}</p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <span className="rounded-full bg-[#1D2742] px-3 py-1 text-xs font-semibold text-white">{tv("all")}</span>
          <span className="rounded-full border border-[#DCE3F2] px-3 py-1 text-xs font-semibold text-[#1D2742]">{tv("kspo")}</span>
          <span className="rounded-full border border-[#DCE3F2] px-3 py-1 text-xs font-semibold text-[#1D2742]">{tv("handball")}</span>
          <span className="rounded-full border border-[#DCE3F2] px-3 py-1 text-xs font-semibold text-[#1D2742]">{tv("olympic")}</span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3">
        {cards.map((item) => (
          <PerformanceCard key={item.id} item={item} locale={locale} />
        ))}
      </section>

      <BottomNav active="concerts" />
    </main>
  );
}

function PerformanceCard({ item, locale }: { item: Performance; locale: "ko" | "zh-TW" }) {
  const dday = getDDay(item.start_date);
  const title = locale === "ko" ? item.title_ko : item.title_zh_tw ?? item.title_ko;
  const venue = locale === "ko" ? item.venue?.name_ko : item.venue?.name_zh_tw;
  const ticket = item.ticket_links?.[0];

  return (
    <article className="rounded-2xl border border-[#E2E8F5] bg-white p-3 shadow-sm">
      <div className="mb-3 h-40 overflow-hidden rounded-xl bg-[#E9EEF8]">
        {item.poster_url ? (
          <Image src={item.poster_url} alt={title} width={800} height={320} className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-bold text-[#1D2742]">{title}</h2>
        <span className="rounded-full bg-[#FF2E63]/10 px-2 py-1 text-xs font-bold text-[#FF2E63]">{dday <= 0 ? "D-Day" : `D-${dday}`}</span>
      </div>

      <p className="mb-1 flex items-center gap-1 text-sm text-[#4B587C]">
        <MapPin className="h-4 w-4" />
        {venue}
      </p>
      <p className="mb-3 flex items-center gap-1 text-sm text-[#4B587C]">
        <CalendarDays className="h-4 w-4" />
        {formatDateByLocale(item.start_date, locale)}
      </p>

      {ticket ? (
        <a href={ticket.url} target="_blank" rel="noreferrer" className="inline-flex rounded-lg bg-[#1D2742] px-3 py-2 text-xs font-semibold text-white">
          {ticket.is_global ? "Global Ticket" : "Ticket"}
        </a>
      ) : (
        <span className="inline-flex rounded-lg bg-[#EEF1F8] px-3 py-2 text-xs font-semibold text-[#4B587C]">敬請期待</span>
      )}
    </article>
  );
}
