"use client";

import concerts from "@/data/concerts.json";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Languages, MapPin, Timer, Warehouse } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Locale = "zh-TW" | "ko";
type VenueFilter = "All" | "KSPO Dome" | "Handball" | "Olympic Hall";

type Concert = {
  id: string;
  artist: string;
  venue: VenueFilter;
  date: string;
};

type LockerApiResponse = {
  data: {
    id: string;
    name: string;
    total: number;
    available: number;
    updatedAt: string;
  }[];
};

const venues: VenueFilter[] = ["All", "KSPO Dome", "Handball", "Olympic Hall"];

const copy = {
  "zh-TW": {
    appName: "\u6307\u5357 Jinam",
    subtitle: "\u53f0\u7063\u7c89\u7d72\u5c08\u7528 K-Pop \u6f14\u5531\u6703\u8207\u7f6e\u7269\u6ac3\u5c0e\u822a",
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
    partnerTitle: "\u5408\u4f5c\u8a62\u554f",
    partnerDesc: "\u586b\u5beb\u5f8c\u5c07\u9001\u51fa\u7d66\u71df\u904b\u5718\u968a",
    companyLabel: "\u516c\u53f8\u540d\u7a31",
    contactNameLabel: "\u806f\u7d61\u4eba",
    emailLabel: "\u806f\u7d61\u4fe1\u7bb1",
    messageLabel: "\u8a62\u554f\u5167\u5bb9",
    sendInquiry: "\u9001\u51fa\u8a62\u554f",
  },
  ko: {
    appName: "\uc9c4\ub0a8 Jinam",
    subtitle: "\ub300\ub9cc \ud32c\uc744 \uc704\ud55c K-Pop \uacf5\uc5f0/\ubb3c\ud488\ubcf4\uad00\ud568 \uac00\uc774\ub4dc",
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
    partnerTitle: "\uc81c\ud734 \ubb38\uc758",
    partnerDesc: "\uc791\uc131\ud558\uba74 \uc6b4\uc601\ud300\uc5d0 \ubc14\ub85c \uc804\ub2ec\ub429\ub2c8\ub2e4",
    companyLabel: "\ud68c\uc0ac\uba85",
    contactNameLabel: "\ub2f4\ub2f9\uc790\uba85",
    emailLabel: "\uc5f0\ub77d \uc774\uba54\uc77c",
    messageLabel: "\ubb38\uc758 \ub0b4\uc6a9",
    sendInquiry: "\ubb38\uc758 \ubcf4\ub0b4\uae30",
  },
} as const;

function getDdayLabel(dateString: string, locale: Locale, dayText: string): string {
  const target = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return locale === "ko"
    ? `\uc885\ub8cc +${Math.abs(diff)}${dayText}`
    : `\u5df2\u7d50\u675f +${Math.abs(diff)}${dayText}`;
}

function formatDate(dateString: string, locale: Locale) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(locale === "ko" ? "ko-KR" : "zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

function sameDay(value: Date, dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  return (
    value.getFullYear() === date.getFullYear() &&
    value.getMonth() === date.getMonth() &&
    value.getDate() === date.getDate()
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh-TW");
  const [filter, setFilter] = useState<VenueFilter>("All");
  const [lockers, setLockers] = useState<LockerApiResponse["data"]>([]);

  const isZhTw = locale === "zh-TW";
  const text = copy[locale];
  const textTracking = isZhTw ? "tracking-wider leading-relaxed" : "tracking-normal leading-normal";

  const filteredConcerts = useMemo(() => {
    const list = concerts as Concert[];
    if (filter === "All") return list;
    return list.filter((concert) => concert.venue === filter);
  }, [filter]);

  const todayCount = useMemo(() => {
    const today = new Date();
    return (concerts as Concert[]).filter((concert) => sameDay(today, concert.date)).length;
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchLockers = async () => {
      try {
        const response = await fetch("/api/lockers", { cache: "no-store" });
        const json: LockerApiResponse = await response.json();
        if (mounted) {
          setLockers(json.data);
        }
      } catch {
        if (mounted) {
          setLockers([]);
        }
      }
    };

    fetchLockers();
    const interval = setInterval(fetchLockers, 12000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-10 pt-5 md:px-8">
      <header className="sticky top-3 z-30 mb-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[#FF2E63]">Jinam</p>
            <h1 className={`text-xl font-bold text-[#1D2742] ${textTracking}`}>{text.appName}</h1>
            <p className={`text-xs text-[#4B587C] ${textTracking}`}>{text.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#E2E8F5] bg-[#F8FAFE] p-1">
            <Languages className="h-4 w-4 text-[#1D2742]" />
            {(["zh-TW", "ko"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  locale === lang ? "bg-[#1D2742] text-white" : "text-[#1D2742]"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mb-5 rounded-2xl bg-[#1D2742] p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <Timer className="h-5 w-5 text-[#FF2E63]" />
          <div>
            <p className={`text-sm opacity-90 ${textTracking}`}>{text.todayConcerts}</p>
            <p className={`text-2xl font-bold ${textTracking}`}>
              {todayCount} {text.events}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-xl border border-[#E2E8F5] bg-white p-2">
          {venues.map((venue) => {
            const label = venue === "All" ? text.all : venue;
            const active = filter === venue;

            return (
              <motion.button
                layout
                key={venue}
                onClick={() => setFilter(venue)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? "text-white" : "text-[#1D2742]"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="venue-pill"
                    className="absolute inset-0 rounded-full bg-[#FF2E63]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-[#1D2742]">
          <CalendarDays className="h-5 w-5" />
          <h2 className={`text-lg font-bold ${textTracking}`}>{text.concertList}</h2>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredConcerts.map((concert) => (
              <motion.article
                key={concert.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border border-[#E2E8F5] bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-[#1D2742]">{concert.artist}</h3>
                  <span className="rounded-full bg-[#FF2E63]/10 px-2.5 py-1 text-xs font-bold text-[#FF2E63]">
                    {getDdayLabel(concert.date, locale, text.day)}
                  </span>
                </div>

                <p className="mb-1 flex items-center gap-1 text-sm text-[#4B587C]">
                  <MapPin className="h-4 w-4" />
                  {concert.venue}
                </p>
                <p className="text-sm text-[#4B587C]">{formatDate(concert.date, locale)}</p>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="rounded-2xl border border-[#E2E8F5] bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-[#1D2742]">
          <Warehouse className="h-5 w-5" />
          <div>
            <h2 className={`text-lg font-bold ${textTracking}`}>{text.lockerTitle}</h2>
            <p className={`text-xs text-[#4B587C] ${textTracking}`}>{text.lockerDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {lockers.map((locker) => {
            const ratio = locker.total === 0 ? 0 : locker.available / locker.total;
            const status = ratio > 0.45 ? "safe" : ratio > 0.1 ? "busy" : "full";
            const statusClass =
              status === "safe"
                ? "bg-emerald-100 text-emerald-700"
                : status === "busy"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700";

            return (
              <div key={locker.id} className="rounded-xl border border-[#E2E8F5] bg-[#F9FBFF] p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-semibold text-[#1D2742]">{locker.name}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass}`}>
                    {status === "safe" ? text.safe : status === "busy" ? text.busy : text.full}
                  </span>
                </div>

                <p className="text-sm text-[#4B587C]">
                  {text.available} / {text.total}: <span className="font-bold">{locker.available}</span> / {locker.total}
                </p>
                <p className="mt-1 text-xs text-[#6E7B9A]">
                  {text.updated}: {new Date(locker.updatedAt).toLocaleTimeString(locale === "ko" ? "ko-KR" : "zh-TW")}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#E2E8F5] bg-white p-4 shadow-sm">
        <div className="mb-3">
          <h2 className={`text-lg font-bold text-[#1D2742] ${textTracking}`}>{text.partnerTitle}</h2>
          <p className={`text-xs text-[#4B587C] ${textTracking}`}>{text.partnerDesc}</p>
        </div>

        <form action="https://formspree.io/f/mdalgwdq" method="POST" className="grid grid-cols-1 gap-3">
          <input type="hidden" name="_subject" value="Jinam partnership inquiry" />

          <label className="grid gap-1 text-sm font-medium text-[#1D2742]">
            {text.companyLabel}
            <input
              name="company"
              required
              className="rounded-lg border border-[#D8E0F0] px-3 py-2 text-sm outline-none transition focus:border-[#FF2E63]"
              placeholder="Jinam Corp."
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-[#1D2742]">
            {text.contactNameLabel}
            <input
              name="name"
              required
              className="rounded-lg border border-[#D8E0F0] px-3 py-2 text-sm outline-none transition focus:border-[#FF2E63]"
              placeholder="Jane Kim"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-[#1D2742]">
            {text.emailLabel}
            <input
              type="email"
              name="email"
              required
              className="rounded-lg border border-[#D8E0F0] px-3 py-2 text-sm outline-none transition focus:border-[#FF2E63]"
              placeholder="name@company.com"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-[#1D2742]">
            {text.messageLabel}
            <textarea
              name="message"
              required
              rows={5}
              className="rounded-lg border border-[#D8E0F0] px-3 py-2 text-sm outline-none transition focus:border-[#FF2E63]"
              placeholder="Partnership details..."
            />
          </label>

          <button
            type="submit"
            className="mt-1 w-full rounded-lg bg-[#1D2742] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#121a30]"
          >
            {text.sendInquiry}
          </button>
        </form>
      </section>
    </main>
  );
}
