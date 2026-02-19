"use client";

import type { Performance } from "@/types/performance";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
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
      <section className="mb-4 rounded-2xl border border-[#E2E8F5] bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-[#4B587C]">{filterLabel}</p>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth("prev")}
            className="rounded border border-[#DCE3F2] p-1 text-[#1D2742]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-[#1D2742]">{getMonthTitle(calendarYear, calendarMonth, locale)}</p>
          <button
            type="button"
            onClick={() => changeMonth("next")}
            className="rounded border border-[#DCE3F2] p-1 text-[#1D2742]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
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
                className={`rounded-md px-2 py-1 text-xs font-normal ${
                  active
                    ? "bg-[#1D2742] text-white"
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
          const ticket = item.ticket_links?.[0];
          return (
            <article key={item.id} className="rounded-2xl border border-[#E2E8F5] bg-white p-3 shadow-sm">
              <div className="mb-3 h-44 overflow-hidden rounded-xl bg-[#E9EEF8]">
                {item.poster_url ? (
                  <Image src={item.poster_url} alt={title} width={800} height={360} className="h-full w-full object-cover" />
                ) : null}
              </div>

              <div className="mb-2 flex items-center gap-2 text-[#1D2742]">
                <CalendarDays className="h-4 w-4" />
                <p className="text-cjk-body text-sm font-normal">{formatDateByLocale(item.start_date, locale)}</p>
              </div>
              <h2 className="text-base font-semibold text-[#1D2742]">{title}</h2>
              <p className="text-cjk-body mt-1 flex items-center gap-1 text-sm font-normal text-[#4B587C]">
                <MapPin className="h-4 w-4" />
                {venue}
              </p>

              {ticket ? (
                <a
                  href={ticket.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex rounded-lg bg-[#1D2742] px-3 py-2 text-xs font-semibold text-white"
                >
                  {ticket.is_global ? "Global Ticket" : "Ticket"}
                </a>
              ) : (
                <span className="mt-3 inline-flex rounded-lg bg-[#EEF1F8] px-3 py-2 text-xs font-semibold text-[#4B587C]">敬請期待</span>
              )}
            </article>
          );
        })}
      </section>
    </>
  );
}
