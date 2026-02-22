"use client";

import type { Performance } from "@/types/performance";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useMemo, useState } from "react";

type ViewMode = "image" | "text" | "calendar";

type Props = {
  items: Performance[];
  locale: "ko" | "zh-TW";
  labels: {
    monthView: string;
    prevYear: string;
    nextYear: string;
    detail: string;
    empty: string;
    dday: string;
    ddayPrefix: string;
    viewImage: string;
    viewText: string;
    viewCalendar: string;
    noImage: string;
    timeLabel: string;
  };
};

function formatDateByLocale(date: string, locale: "ko" | "zh-TW") {
  const d = new Date(`${date}T00:00:00+09:00`);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return locale === "ko" ? `${y}.${m}.${day}` : `${y}/${m}/${day}`;
}

function getMonthTitle(year: number, monthIndex: number) {
  return `${year}.${String(monthIndex + 1).padStart(2, "0")}`;
}

function getDdayLabel(startDate: string, labels: Props["labels"]) {
  const start = new Date(`${startDate}T00:00:00+09:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return labels.dday;
  return `${labels.ddayPrefix}${diff}`;
}

export default function PerformanceCalendarBoard({
  items,
  locale,
  labels,
}: Props) {
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState<ViewMode>("image");

  const filteredCards = useMemo(() => {
    return items.filter((item) => {
      const d = new Date(`${item.start_date}T00:00:00+09:00`);
      return d.getFullYear() === calendarYear && d.getMonth() === calendarMonth;
    });
  }, [items, calendarMonth, calendarYear]);

  const changeMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCalendarYear((prev) => prev - 1);
      return;
    }
    setCalendarYear((prev) => prev + 1);
  };

  return (
    <>
      <section className="mb-4 rounded-3xl border border-[#E2E8F5] bg-white p-3 shadow-[0_8px_20px_rgba(29,39,66,0.05)]">
        <div className="mb-3 grid grid-cols-3 overflow-hidden rounded-xl border border-[#DCE3F2] bg-[#F8FAFF]">
          <button
            type="button"
            onClick={() => setViewMode("image")}
            className={`py-2 text-sm font-semibold ${viewMode === "image" ? "bg-[#3F3F3F] text-white" : "text-[#4B587C]"}`}
          >
            {labels.viewImage}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("text")}
            className={`border-x border-[#DCE3F2] py-2 text-sm font-semibold ${viewMode === "text" ? "bg-[#3F3F3F] text-white" : "text-[#4B587C]"}`}
          >
            {labels.viewText}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`py-2 text-sm font-semibold ${viewMode === "calendar" ? "bg-[#3F3F3F] text-white" : "text-[#4B587C]"}`}
          >
            {labels.viewCalendar}
          </button>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-[#4B587C]">{labels.monthView}</p>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth("prev")}
            className="rounded-lg border border-[#DCE3F2] p-1 text-[#1D2742]"
            aria-label={labels.prevYear}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-[#1D2742]">{getMonthTitle(calendarYear, calendarMonth)}</p>
          <button
            type="button"
            onClick={() => changeMonth("next")}
            className="rounded-lg border border-[#DCE3F2] p-1 text-[#1D2742]"
            aria-label={labels.nextYear}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {Array.from({ length: 12 }, (_, idx) => {
            const month = idx + 1;
            const active = calendarMonth === idx;
            return (
              <button
                key={month}
                type="button"
                onClick={() => setCalendarMonth(idx)}
                className={`rounded-lg px-2 py-1.5 text-xs font-normal ${
                  active ? "bg-[#1D2742] text-white shadow-sm" : "bg-[#EEF3FF] text-[#1D2742]"
                }`}
              >
                {locale === "ko" ? `${month}월` : `${month}月`}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DCE3F2] bg-white px-4 py-8 text-center text-sm text-[#6E7B9A]">
            {labels.empty}
          </div>
        ) : null}
        {filteredCards.map((item) => {
          const title = locale === "ko" ? item.title_ko : item.title_zh_tw ?? item.title_ko;
          const venue = locale === "ko" ? item.venue?.name_ko : item.venue?.name_zh_tw;
          const ddayLabel = getDdayLabel(item.start_date, labels);
          const timeText = item.start_time ?? "-";

          if (viewMode === "text") {
            return (
              <Link key={item.id} href={`/concerts/${item.id}`} locale={locale} className="rounded-2xl border border-[#E2E8F5] bg-white px-4 py-3 shadow-[0_8px_16px_rgba(29,39,66,0.05)]">
                <h3 className="line-clamp-1 text-sm font-semibold text-[#1D2742]">{title}</h3>
                <p className="mt-1 text-xs text-[#4B587C]">{venue ?? "-"}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-[#6E7B9A]">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDateByLocale(item.start_date, locale)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {timeText}
                  </span>
                </div>
              </Link>
            );
          }

          if (viewMode === "calendar") {
            return (
              <Link key={item.id} href={`/concerts/${item.id}`} locale={locale} className="rounded-2xl border border-[#E2E8F5] bg-white px-4 py-3 shadow-[0_8px_16px_rgba(29,39,66,0.05)]">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-[#EEF3FF] px-2 py-1 text-[11px] font-semibold text-[#295FA8]">{formatDateByLocale(item.start_date, locale)}</span>
                  <span className="rounded-full bg-[#FFEAF0] px-2 py-1 text-[11px] font-semibold text-[#FF2E63]">{ddayLabel}</span>
                </div>
                <h3 className="line-clamp-2 text-sm font-semibold text-[#1D2742]">{title}</h3>
                <p className="mt-1 text-xs text-[#4B587C]">{venue ?? "-"}</p>
                <p className="mt-1 text-xs text-[#4B587C]">
                  {labels.timeLabel}: {timeText}
                </p>
              </Link>
            );
          }

          return (
            <Link key={item.id} href={`/concerts/${item.id}`} locale={locale} className="group overflow-hidden rounded-3xl border border-[#E2E8F5] bg-white shadow-[0_10px_24px_rgba(29,39,66,0.08)] transition hover:-translate-y-0.5">
              <article>
                <div className="relative h-52 overflow-hidden bg-[#E9EEF8]">
                  {item.poster_url ? (
                    <Image src={item.poster_url} alt={title} width={900} height={420} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#6E7B9A]">{labels.noImage}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                    <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#1D2742]">
                      {ddayLabel}
                    </span>
                    <span className="inline-flex rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white">
                      {venue ?? "-"}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h2 className="line-clamp-2 text-[17px] font-semibold leading-tight">{title}</h2>
                    <div className="mt-1 flex items-center gap-1.5 text-[12px] opacity-95">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <p className="text-cjk-body font-normal">{formatDateByLocale(item.start_date, locale)}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[12px] opacity-95">
                      <Clock3 className="h-3.5 w-3.5" />
                      <p className="text-cjk-body font-normal">{timeText}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  <p className="text-cjk-body flex items-center gap-1 text-xs font-normal text-[#4B587C]">
                    <MapPin className="h-3.5 w-3.5" />
                    {venue ?? "-"}
                  </p>
                  <span className="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-[10px] font-semibold text-[#295FA8]">
                    {labels.detail}
                  </span>
                </div>
              </article>
            </Link>
          );
        })}
      </section>
    </>
  );
}
