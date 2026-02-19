import { Link } from "@/i18n/navigation";
import BottomNav from "@/components/ui/bottom-nav";
import PerformanceCalendarBoard from "@/components/concert/performance-calendar-board";
import { fetchPerformances } from "@/lib/performances/repository";
import { Globe } from "lucide-react";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" }>;
};

export default async function LocalizedDashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Dashboard");
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
            <p className="text-xs font-normal text-[#4B587C]">{t("adminReady")}</p>
            <h1 className="text-xl font-semibold text-[#1D2742]">{t("title")}</h1>
            <p className="text-cjk-body text-xs font-normal text-[#6E7B9A]">{t("subtitle")}</p>
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

      <PerformanceCalendarBoard
        items={cards}
        locale={locale}
        filterLabel={t("filterLabel")}
      />

      <BottomNav active="concerts" />
    </main>
  );
}
