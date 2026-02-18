import EventCard from "@/components/concert/event-card";
import FilterBar from "@/components/concert/filter-bar";
import BottomNav from "@/components/ui/bottom-nav";
import LanguageToggle from "@/components/ui/language-toggle";
import { fetchPerformances } from "@/lib/performances/repository";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" }>;
  searchParams: Promise<{
    date?: string;
    venue?: string;
    sort?: "date_asc" | "date_desc";
  }>;
};

function formatDateLabel(startDate: string, locale: "ko" | "zh-TW") {
  const date = new Date(`${startDate}T00:00:00+09:00`);
  return date.toLocaleDateString(locale === "ko" ? "ko-KR" : "zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

export default async function ConcertsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const qs = await searchParams;
  const t = await getTranslations("Dashboard");
  const performances = await fetchPerformances();

  const now = new Date().toISOString().slice(0, 10);
  const base = performances.filter((item) => item.start_date >= now && item.status !== "finished");

  const byDate = qs.date ? base.filter((item) => item.start_date === qs.date) : base;
  const byVenue = qs.venue ? byDate.filter((item) => item.venue?.slug === qs.venue) : byDate;
  const sortOrder = qs.sort ?? "date_asc";
  const ordered = [...byVenue].sort((a, b) =>
    sortOrder === "date_desc" ? b.start_date.localeCompare(a.start_date) : a.start_date.localeCompare(b.start_date),
  );

  const venueOptions = [
    { value: "", label: t("filterLabel") },
    { value: "kspo-dome", label: "KSPO DOME" },
    { value: "handball", label: locale === "ko" ? "핸드볼경기장" : "手球館" },
    { value: "olympic-hall", label: locale === "ko" ? "올림픽홀" : "奧林匹克廳" },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-6xl bg-[#F5F7FB] px-4 pb-28 pt-5">
      <header className="mb-4 rounded-2xl border border-[#E2E8F5] bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-[#1D2742]">{t("title")}</h1>
            <p className="text-xs text-[#6E7B9A]">{t("subtitle")}</p>
          </div>
          <LanguageToggle current={locale} />
        </div>
      </header>

      <div className="mb-4">
        <FilterBar
          venueOptions={venueOptions}
          sortOptions={[
            { value: "date_asc", label: t("sortDateAsc") },
            { value: "date_desc", label: t("sortDateDesc") },
          ]}
          labels={{
            date: locale === "ko" ? "날짜" : "日期",
            venue: locale === "ko" ? "공연장" : "場館",
            sort: t("sortLabel"),
            reset: locale === "ko" ? "초기화" : "重設",
          }}
        />
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {ordered.map((concert) => {
          const titleZh = concert.title_zh_tw ?? undefined;
          const venueZh = concert.venue?.name_zh_tw ?? undefined;
          const startTime = "19:00";
          return (
            <EventCard
              key={concert.id}
              locale={locale}
              id={concert.id}
              dateLabel={formatDateLabel(concert.start_date, locale)}
              titleKo={concert.title_ko}
              titleZhTw={titleZh}
              venueKo={concert.venue?.name_ko ?? "-"}
              venueZhTw={venueZh}
              startTime={startTime}
              imageUrl={concert.poster_url ?? undefined}
            />
          );
        })}
      </section>

      <BottomNav active="concerts" />
    </main>
  );
}
