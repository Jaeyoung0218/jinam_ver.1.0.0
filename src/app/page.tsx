"use client";

import concerts from "@/data/concerts.json";
import BottomNav from "@/components/ui/bottom-nav";
import SurvivalMapFab from "@/components/concert/survival-map-fab";
import LockerWidget from "@/components/map/locker-widget";
import type { Concert, Venue } from "@/types/concert";
import { CalendarDays, ChevronLeft, ChevronRight, Languages, MapPin, MessageCircle, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Locale = "zh-TW" | "ko";
type VenueFilter = "All" | Venue;

const venues: VenueFilter[] = ["All", "KSPO Dome", "Handball", "Olympic Hall"];

const posterToneClass: Record<Concert["posterTone"], string> = {
  pink: "from-rose-400 to-pink-600",
  violet: "from-violet-400 to-purple-600",
  sky: "from-sky-400 to-cyan-600",
  amber: "from-amber-400 to-orange-600",
  emerald: "from-emerald-400 to-teal-600",
  indigo: "from-indigo-400 to-blue-700",
};

const posterToneRingClass: Record<Concert["posterTone"], string> = {
  pink: "ring-rose-300",
  violet: "ring-violet-300",
  sky: "ring-sky-300",
  amber: "ring-amber-300",
  emerald: "ring-emerald-300",
  indigo: "ring-indigo-300",
};

const copy = {
  "zh-TW": {
    appName: "\u6307\u5357 Jinam",
    subtitle: "\u53f0\u7063\u7c89\u7d72\u5c08\u7528 K-Pop \u6f14\u5531\u6703\u8207\u7f6e\u7269\u6ac3\u5c0e\u822a",
    heroLead: "\u53f0\u7063\u7c89\u7d72\u5c08\u7528\uff5c\u5967\u6797\u5339\u514b\u516c\u5712\u6f14\u5531\u6703\u5373\u6642\u6307\u5357 (Jinam)",
    featureToday: "\ud83c\udfa4 \u4eca\u65e5\u6f14\u5531\u6703",
    featureLocker: "\ud83d\udd12 \u7f6e\u7269\u6ac3\u5269\u9918\u91cf",
    featureLine: "\ud83d\udcac LINE \u73fe\u5834\u804a\u5929\u5ba4",
    exploreTitle: "\u4eca\u5929\u60f3\u901b\u54ea\u88e1\uff1f",
    more: "\u66f4\u591a\u770b\u770b",
    todayConcerts: "\u4eca\u65e5\u6f14\u5531\u6703",
    events: "\u5834",
    concertList: "\u6f14\u5531\u6703\u5217\u8868",
    lockerTitle: "\u7f6e\u7269\u6ac3\u751f\u5b58\u5730\u5716",
    lockerDesc: "T-Locker (\ub610\ub530\ub77c\ucee4) \u5373\u6642\u72c0\u614b",
    all: "\u5168\u90e8",
    day: "\u5929",
    safe: "\u5b89\u5168",
    busy: "\u64c1\u64e0",
    full: "\u5df2\u6eff",
    available: "\u53ef\u7528",
    total: "\u7e3d\u6578",
    updated: "\u66f4\u65b0\u6642\u9593",
    liveState: "\u73fe\u5834\u5373\u6642\u72c0\u614b",
    lineEntry: "LINE \u793e\u7fa4",
    lineJoin: "\u52a0\u5165 LINE Open Chat",
    detail: "\u770b\u8a73\u60c5",
    ticket: "\u8a02\u7968",
    miniGuide: "\u8ff7\u4f60\u6307\u5357",
    miniGuideDesc: "\u73fe\u5834\u5c0f\u6280\u5de7 / \u672b\u73ed\u8eca / \u79fb\u52d5\u8def\u7dda",
    loadError: "\u66ab\u6642\u7121\u6cd5\u8b80\u53d6\u7f6e\u7269\u6ac3\u8cc7\u6599",
    lockerDecisionTitle: "\u73fe\u5728\u53bb\u6709\u4f4d\u7f6e\u55ce\uff1f",
    goNow: "\u53ef\u4ee5\u73fe\u5728\u53bb",
    hurry: "\u5efa\u8b70\u76e1\u5feb\u524d\u5f80",
    noSeat: "\u7a7a\u4f4d\u5f88\u5c11\uff0c\u5efa\u8b70\u66ff\u4ee3\u7ad9\u9ede",
    loadingConcerts: "\u8f09\u5165\u6f14\u5531\u6703\u8cc7\u6599\u4e2d...",
    loadingLockers: "\u8f09\u5165\u7f6e\u7269\u6ac3\u8cc7\u6599\u4e2d...",
  },
  ko: {
    appName: "\uc9c4\ub0a8 Jinam",
    subtitle: "\ub300\ub9cc \ud32c\uc744 \uc704\ud55c K-Pop \uacf5\uc5f0/\ubb3c\ud488\ubcf4\uad00\ud568 \uac00\uc774\ub4dc",
    heroLead: "\ub300\ub9cc \ud32c \uc804\uc6a9 |\uc62c\ub9bc\ud53d\uacf5\uc6d0 \ucf58\uc11c\ud2b8 \uc2e4\uc2dc\uac04 \uac00\uc774\ub4dc (Jinam)",
    featureToday: "\ud83c\udfa4 \uc624\ub298\uc758 \ucf58\uc11c\ud2b8",
    featureLocker: "\ud83d\udd12 \ub77d\ucee4 \uc794\uc5ec\ub7c9",
    featureLine: "\ud83d\udcac LINE \ud604\uc7a5 \ucc44\ud305\ubc29",
    exploreTitle: "\uc624\ub298\uc740 \uc5b4\ub514\ub97c \ub3cc\uc544\ubcfc\uae4c\uc694?",
    more: "\ub354\ubcf4\uae30",
    todayConcerts: "\uc624\ub298\uc758 \ucf58\uc11c\ud2b8",
    events: "\uac74",
    concertList: "\ucf58\uc11c\ud2b8 \ubaa9\ub85d",
    lockerTitle: "\ub77d\ucee4 \uc0dd\uc874 \ub9f5",
    lockerDesc: "T-Locker (\ub610\ub530\ub77c\ucee4) \uc2e4\uc2dc\uac04 \ud604\ud669",
    all: "\uc804\uccb4",
    day: "\uc77c",
    safe: "\uc5ec\uc720",
    busy: "\ud63c\uc7a1",
    full: "\ub9cc\uc11d",
    available: "\uc0ac\uc6a9 \uac00\ub2a5",
    total: "\uc804\uccb4",
    updated: "\uc5c5\ub370\uc774\ud2b8",
    liveState: "\ud604\uc7a5 \uc2e4\uc2dc\uac04 \uc0c1\ud669",
    lineEntry: "LINE \ucee4\ubba4\ub2c8\ud2f0",
    lineJoin: "LINE \uc624\ud508\ucc57 \ucc38\uc5ec",
    detail: "\uc0c1\uc138 \ubcf4\uae30",
    ticket: "\ud2f0\ucf13 \uc608\ub9e4",
    miniGuide: "\ubbf8\ub2c8 \uac00\uc774\ub4dc",
    miniGuideDesc: "\uafc0\ud301 / \ub9c9\ucc28 / \ub3d9\uc120 \uc815\ub9ac",
    loadError: "\ub77d\ucee4 \ub370\uc774\ud130\ub97c \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4",
    lockerDecisionTitle: "\uc9c0\uae08 \uac00\ub3c4 \uc790\ub9ac \uc788\ub098\uc694?",
    goNow: "\uc9c0\uae08 \uc774\ub3d9 \ucd94\ucc9c",
    hurry: "\uc11c\ub450\ub974\uba74 \uc774\uc6a9 \uac00\ub2a5",
    noSeat: "\uc790\ub9ac\uac00 \uac70\uc758 \uc5c6\uc5b4 \ub2e4\ub978 \uc5ed \uad8c\uc7a5",
    loadingConcerts: "\ucf58\uc11c\ud2b8 \uc815\ubcf4 \ub85c\ub529 \uc911...",
    loadingLockers: "\ub77d\ucee4 \uc815\ubcf4 \ub85c\ub529 \uc911...",
  },
} as const;

function getDdayLabel(dateString: string, endDateString: string | undefined): string | null {
  const target = new Date(`${dateString}T00:00:00`);
  const endDate = new Date(`${(endDateString ?? dateString)}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (today >= target && today <= endDate) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return null;
}

function formatDate(dateString: string, locale: Locale) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(locale === "ko" ? "ko-KR" : "zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

function formatDateRange(dateString: string, endDateString: string | undefined, locale: Locale) {
  const start = formatDate(dateString, locale);
  if (!endDateString || endDateString === dateString) return start;
  return `${start} - ${formatDate(endDateString, locale)}`;
}

function sameDay(value: Date, dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  return (
    value.getFullYear() === date.getFullYear() &&
    value.getMonth() === date.getMonth() &&
    value.getDate() === date.getDate()
  );
}

function getNextDateString(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getConcertExpiryAt(concert: Concert) {
  // If endDate is not provided, expire at the same start time on the next day.
  const effectiveEndDate = concert.endDate ?? getNextDateString(concert.date);
  return new Date(`${effectiveEndDate}T${concert.startTime}:00`);
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh-TW");
  const [filter, setFilter] = useState<VenueFilter>("All");
  const [concertsLoading, setConcertsLoading] = useState(true);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);

  const isZhTw = locale === "zh-TW";
  const text = copy[locale];
  const textTracking = isZhTw ? "tracking-wider leading-relaxed" : "tracking-normal leading-normal";
  const liveConcerts = useMemo(() => {
    const now = new Date();
    return (concerts as Concert[]).filter((concert) => now < getConcertExpiryAt(concert));
  }, []);

  const filteredConcerts = useMemo(() => {
    const list = liveConcerts;
    if (filter === "All") return list;
    return list.filter((concert) => concert.venue === filter);
  }, [filter, liveConcerts]);

  const todayCount = useMemo(() => {
    const today = new Date();
    return liveConcerts.filter((concert) => sameDay(today, concert.date)).length;
  }, [liveConcerts]);

  useEffect(() => {
    const timer = setTimeout(() => setConcertsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const changeCalendarMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (calendarMonth === 1) {
        setCalendarYear((prev) => prev - 1);
        setCalendarMonth(12);
      } else {
        setCalendarMonth((prev) => prev - 1);
      }
      return;
    }
    if (calendarMonth === 12) {
      setCalendarYear((prev) => prev + 1);
      setCalendarMonth(1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-[760px] bg-[#F5F7FB] px-5 pb-28 pt-5 transition-all duration-200">
      <header className="sticky top-0 z-30 -mx-5 mb-5 border-b border-[#E7EAF1] bg-[#F5F7FB]/95 px-5 pb-4 pt-5 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[30px] font-extrabold leading-none text-[#253B8F]">Jinam</p>
            <p className="text-xs font-medium text-[#7A879F]">Concert place companion</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-[#DDE3EE] bg-white p-1">
              <Languages className="h-4 w-4 text-[#1D2742]" />
              {(["zh-TW", "ko"] as Locale[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                    locale === lang ? "bg-[#1D2742] text-white" : "text-[#1D2742]"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button className="rounded-full border border-[#DDE3EE] p-2 text-[#1D2742]">
              <UserRound className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-[#3A8DED] px-4 py-3 text-center text-sm font-bold text-white">{text.heroLead}</div>

      </header>

      <section className="surface-card mb-5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => changeCalendarMonth("prev")} className="rounded-lg border border-[#E1E7F2] p-2 text-[#1D2742]">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-4xl font-extrabold tracking-tight text-[#1D2742]">
            {calendarYear}.{String(calendarMonth).padStart(2, "0")}
          </p>
          <button onClick={() => changeCalendarMonth("next")} className="rounded-lg border border-[#E1E7F2] p-2 text-[#1D2742]">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-xl border border-[#E8ECF4] bg-[#F8FAFD] p-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <button
              key={month}
              onClick={() => setCalendarMonth(month)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold ${
                month === calendarMonth ? "bg-white text-[#1D2742] shadow-sm" : "text-[#6A7591]"
              }`}
            >
              {month}月
            </button>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <h2 className={`mb-3 text-3xl font-extrabold text-[#0F172A] ${textTracking}`}>{text.exploreTitle}</h2>
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          {venues.map((venue) => {
            const label = venue === "All" ? text.all : venue;
            const active = filter === venue;
            return (
              <button
                key={venue}
                onClick={() => setFilter(venue)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${
                  active ? "border-[#1D2742] bg-[#1D2742] text-white" : "border-[#D9E0EB] bg-white text-[#1D2742]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-5">
        <a
          href={(concerts as Concert[])[0]?.lineOpenChatUrl}
          target="_blank"
          rel="noreferrer"
          className="surface-card flex items-center justify-between p-4 transition hover:-translate-y-0.5"
        >
          <div>
            <p className="text-xs font-semibold text-[#4B587C]">{text.lineEntry}</p>
            <p className="text-sm font-bold text-[#1D2742]">{text.lineJoin}</p>
          </div>
          <MessageCircle className="h-5 w-5 text-[#06C755]" />
        </a>
      </section>

      <section className="mb-4 rounded-2xl bg-[#F4F6FA] px-4 py-3">
        <div className="flex items-center justify-between">
          <p className={`text-sm font-semibold text-[#1D2742] ${textTracking}`}>
            {text.todayConcerts}: {todayCount}
            {text.events}
          </p>
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-[#4B587C]">
            {text.more}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-[#1D2742]">
          <CalendarDays className="h-5 w-5" />
          <h2 className={`text-lg font-bold ${textTracking}`}>{text.concertList}</h2>
        </div>

        {concertsLoading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="surface-card p-4">
                <div className="skeleton mb-3 h-20 rounded-xl" />
                <div className="skeleton mb-2 h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredConcerts.map((concert) => (
              <Link
                key={concert.id}
                href={`/concerts/${concert.id}`}
                className={`group block overflow-hidden rounded-2xl ring-1 ${posterToneRingClass[concert.posterTone]} transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]`}
              >
              {(() => {
                const ddayLabel = getDdayLabel(concert.date, concert.endDate);
                return (
                <div
                  className={`relative h-52 w-full overflow-hidden bg-gradient-to-b ${posterToneClass[concert.posterTone]}`}
                >
                  {ddayLabel ? (
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#FF2E63]">
                      {ddayLabel}
                    </span>
                  ) : null}

                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 to-transparent p-4 text-white">
                    <h3 className="text-2xl font-extrabold">{concert.artist}</h3>
                    <p className="mt-1 flex items-center gap-1 text-base opacity-95">
                      <MapPin className="h-4 w-4" />
                      {concert.venue}
                    </p>
                    <p className="text-base opacity-95">
                      {formatDateRange(concert.date, concert.endDate, locale)} · {concert.startTime}
                    </p>
                  </div>
                </div>
                );
              })()}
              </Link>
            ))}
          </div>
        )}
      </section>

      <LockerWidget lineUrl={(concerts as Concert[])[0]?.lineOpenChatUrl} locale={locale} />

      <SurvivalMapFab locale={locale} />

      <BottomNav active="concerts" />
    </main>
  );
}
