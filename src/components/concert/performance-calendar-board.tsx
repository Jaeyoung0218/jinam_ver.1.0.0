"use client";

import type { Performance } from "@/types/performance";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  items: Performance[];
  locale: "ko" | "zh-TW";
  filterLabel: string;
};

function formatDateByLocale(date: string, locale: "ko" | "zh-TW") {
  const d = new Date(`${date}T00:00:00+09:00`);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return locale === "ko" ? `${y}.${m}.${day}` : `${y}/${m}/${day}`;
}

function getMonthTitle(year: number, monthIndex: number, locale: "ko" | "zh-TW") {
  if (locale === "ko") return `${year}년 ${monthIndex + 1}월`;
  return `${year}/${String(monthIndex + 1).padStart(2, "0")}`;
}

function getDdayLabel(startDate: string, locale: "ko" | "zh-TW") {
  const start = new Date(`${startDate}T00:00:00+09:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "D-Day";
  return locale === "ko" ? `D-${diff}` : `倒數 ${diff} 天`;
}

export default function PerformanceCalendarBoard({
  items,
  locale,
  filterLabel,
}: Props) {
  const sortedDates = useMemo(
    () => Array.from(new Set(items.map((item) => item.start_date))).sort((a, b) => a.localeCompare(b)),
    [items],
  );

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const defaultDate = sortedDates.includes(todayKey) ? todayKey : sortedDates[0] ?? "";

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [calendarYear, setCalendarYear] = useState(() => {
    if (!defaultDate) return today.getFullYear();
    return Number(defaultDate.slice(0, 4));
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    if (!defaultDate) return today.getMonth();
    return Number(defaultDate.slice(5, 7)) - 1;
  });

  const dateSet = useMemo(() => new Set(sortedDates), [sortedDates]);

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const dayKeys = Array.from({ length: daysInMonth }, (_, idx) => {
    const day = String(idx + 1).padStart(2, "0");
    const month = String(calendarMonth + 1).padStart(2, "0");
    return `${calendarYear}-${month}-${day}`;
  });

  const filteredCards = useMemo(() => {
    return selectedDate ? items.filter((item) => item.start_date === selectedDate) : items;
  }, [items, selectedDate]);

  const changeMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (calendarMonth === 0) {
        setCalendarYear((prev) => prev - 1);
        setCalendarMonth(11);
      } else {
        setCalendarMonth((prev) => prev - 1);
      }
      return;
    }

    if (calendarMonth === 11) {
      setCalendarYear((prev) => prev + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  return (
    <>
      <section className="mb-4 rounded-3xl border border-[#E2E8F5] bg-white p-3 shadow-[0_8px_20px_rgba(29,39,66,0.05)]">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-[#4B587C]">{filterLabel}</p>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth("prev")}
            className="rounded-lg border border-[#DCE3F2] p-1 text-[#1D2742]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-[#1D2742]">{getMonthTitle(calendarYear, calendarMonth, locale)}</p>
          <button
            type="button"
            onClick={() => changeMonth("next")}
            className="rounded-lg border border-[#DCE3F2] p-1 text-[#1D2742]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {dayKeys.map((dateKey) => {
            const day = Number(dateKey.slice(8, 10));
            const hasEvent = dateSet.has(dateKey);
            const active = selectedDate === dateKey;
            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => hasEvent && setSelectedDate(dateKey)}
                disabled={!hasEvent}
                className={`rounded-lg px-2 py-1.5 text-xs font-normal ${
                  active
                    ? "bg-[#1D2742] text-white shadow-sm"
                    : hasEvent
                      ? "bg-[#EEF3FF] text-[#1D2742]"
                      : "bg-[#F7F8FB] text-[#A0A9BF]"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3">
        {filteredCards.map((item) => {
          const title = locale === "ko" ? item.title_ko : item.title_zh_tw ?? item.title_ko;
          const venue = locale === "ko" ? item.venue?.name_ko : item.venue?.name_zh_tw;
          const ddayLabel = getDdayLabel(item.start_date, locale);
          return (
            <Link key={item.id} href={`/concerts/${item.id}`} locale={locale} className="group overflow-hidden rounded-3xl border border-[#E2E8F5] bg-white shadow-[0_10px_24px_rgba(29,39,66,0.08)] transition hover:-translate-y-0.5">
              <article>
                <div className="relative h-52 overflow-hidden bg-[#E9EEF8]">
                  {item.poster_url ? (
                    <Image src={item.poster_url} alt={title} width={900} height={420} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                  ) : null}
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
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  <p className="text-cjk-body flex items-center gap-1 text-xs font-normal text-[#4B587C]">
                    <MapPin className="h-3.5 w-3.5" />
                    {venue ?? "-"}
                  </p>
                  <span className="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-[10px] font-semibold text-[#295FA8]">
                    {locale === "ko" ? "상세 보기" : "查看詳情"}
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
