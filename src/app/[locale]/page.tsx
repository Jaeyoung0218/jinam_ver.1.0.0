import { Link } from "@/i18n/navigation";
import BottomNav from "@/components/ui/bottom-nav";
import PerformanceCalendarBoard from "@/components/concert/performance-calendar-board";
import { fetchPerformances } from "@/lib/performances/repository";
import { Globe, Lock, MessageCircle, Mic2 } from "lucide-react";
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
  const quickMenus = [
    { icon: Mic2, label: t("quickMenuToday") },
    { icon: Lock, label: t("quickMenuLocker") },
    { icon: MessageCircle, label: t("quickMenuLine") },
  ];
  const sectionTitle = t("nearbyConcerts");

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1200px] bg-[#F5F7FB] px-4 pb-28 pt-5 md:px-6 lg:px-8">
      <header className="mb-3 rounded-3xl border border-[#E2E8F5] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(29,39,66,0.06)]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-normal text-[#4B587C]">{t("adminReady")}</p>
            <h1 className="text-[1.1rem] font-semibold tracking-[-0.01em] text-[#1D2742]">{t("title")}</h1>
            <p className="text-cjk-body text-xs font-normal text-[#6E7B9A]">{t("subtitle")}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F6FD]">
            <Globe className="h-4 w-4 text-[#1D2742]" />
          </div>
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

      <section className="mb-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-[#E8ECF4] bg-white">
        {quickMenus.map((item, idx) => (
          <div key={item.label} className={`flex flex-col items-center justify-center gap-1 px-1 py-3 ${idx === 1 ? "border-x border-[#E8ECF4]" : ""}`}>
            <item.icon className="h-4 w-4 text-[#3A8DED]" />
            <p className="text-center text-[11px] font-semibold text-[#1D2742]">{item.label}</p>
          </div>
        ))}
      </section>

      <div className="mb-2 flex items-center gap-2 px-1">
        <span className="text-sm">🔥</span>
        <p className="text-[13px] font-semibold text-[#1D2742]">{sectionTitle}</p>
      </div>

      <PerformanceCalendarBoard
        items={cards}
        locale={locale}
        labels={{
          monthView: t("monthView"),
          prevYear: t("prevYear"),
          nextYear: t("nextYear"),
          detail: t("detail"),
          empty: t("emptyMonth"),
          dday: t("dday"),
          ddayPrefix: t("ddayPrefix"),
          viewImage: t("viewImage"),
          viewText: t("viewText"),
          viewCalendar: t("viewCalendar"),
          noImage: t("noImage"),
          timeLabel: t("timeLabel"),
        }}
      />

      <BottomNav active="concerts" />
    </main>
  );
}
