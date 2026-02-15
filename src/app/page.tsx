"use client";

import concerts from "@/data/concerts.json";
import type { Concert, Venue } from "@/types/concert";
import { CalendarDays, Languages, MapPin, MessageCircle, Timer, Warehouse } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Locale = "zh-TW" | "ko";
type VenueFilter = "All" | Venue;

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
    quickPartnership: "\u5408\u4f5c\u8a62\u554f",
    loadError: "\u66ab\u6642\u7121\u6cd5\u8b80\u53d6\u7f6e\u7269\u6ac3\u8cc7\u6599",
    lockerDecisionTitle: "\u73fe\u5728\u53bb\u6709\u4f4d\u7f6e\u55ce\uff1f",
    goNow: "\u53ef\u4ee5\u73fe\u5728\u53bb",
    hurry: "\u5efa\u8b70\u76e1\u5feb\u524d\u5f80",
    noSeat: "\u7a7a\u4f4d\u5f88\u5c11\uff0c\u5efa\u8b70\u66ff\u4ee3\u7ad9\u9ede",
    loadingConcerts: "\u8f09\u5165\u6f14\u5531\u6703\u8cc7\u6599\u4e2d...",
    loadingLockers: "\u8f09\u5165\u7f6e\u7269\u6ac3\u8cc7\u6599\u4e2d...",
    partnerTitle: "\u5408\u4f5c\u8a62\u554f",
    partnerDesc: "\u586b\u5beb\u5f8c\u5c07\u9001\u51fa\u7d66\u71df\u904b\u5718\u968a",
    companyLabel: "\u516c\u53f8\u540d\u7a31",
    contactNameLabel: "\u806f\u7d61\u4eba",
    emailLabel: "\u806f\u7d61\u4fe1\u7bb1",
    messageLabel: "\u8a62\u554f\u5167\u5bb9",
    sendInquiry: "\u9001\u51fa\u8a62\u554f",
    formSending: "\u9001\u51fa\u4e2d...",
    formSuccess: "\u9001\u51fa\u6210\u529f\uff01\u6211\u5011\u6703\u76e1\u5feb\u806f\u7d61\u60a8\u3002",
    contactFast: "LINE \u5feb\u901f\u806f\u7d61",
    formFailed: "\u9001\u51fa\u5931\u6557\uff0c\u8acb\u91cd\u8a66\u3002",
    retry: "\u91cd\u8a66",
  },
  ko: {
    appName: "\uc9c4\ub0a8 Jinam",
    subtitle: "\ub300\ub9cc \ud32c\uc744 \uc704\ud55c K-Pop \uacf5\uc5f0/\ubb3c\ud488\ubcf4\uad00\ud568 \uac00\uc774\ub4dc",
    heroLead: "\ub300\ub9cc \ud32c \uc804\uc6a9 |\uc62c\ub9bc\ud53d\uacf5\uc6d0 \ucf58\uc11c\ud2b8 \uc2e4\uc2dc\uac04 \uac00\uc774\ub4dc (Jinam)",
    featureToday: "\ud83c\udfa4 \uc624\ub298\uc758 \ucf58\uc11c\ud2b8",
    featureLocker: "\ud83d\udd12 \ub77d\ucee4 \uc794\uc5ec\ub7c9",
    featureLine: "\ud83d\udcac LINE \ud604\uc7a5 \ucc44\ud305\ubc29",
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
    quickPartnership: "\uc81c\ud734 \ubb38\uc758",
    loadError: "\ub77d\ucee4 \ub370\uc774\ud130\ub97c \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4",
    lockerDecisionTitle: "\uc9c0\uae08 \uac00\ub3c4 \uc790\ub9ac \uc788\ub098\uc694?",
    goNow: "\uc9c0\uae08 \uc774\ub3d9 \ucd94\ucc9c",
    hurry: "\uc11c\ub450\ub974\uba74 \uc774\uc6a9 \uac00\ub2a5",
    noSeat: "\uc790\ub9ac\uac00 \uac70\uc758 \uc5c6\uc5b4 \ub2e4\ub978 \uc5ed \uad8c\uc7a5",
    loadingConcerts: "\ucf58\uc11c\ud2b8 \uc815\ubcf4 \ub85c\ub529 \uc911...",
    loadingLockers: "\ub77d\ucee4 \uc815\ubcf4 \ub85c\ub529 \uc911...",
    partnerTitle: "\uc81c\ud734 \ubb38\uc758",
    partnerDesc: "\uc791\uc131\ud558\uba74 \uc6b4\uc601\ud300\uc5d0 \ubc14\ub85c \uc804\ub2ec\ub429\ub2c8\ub2e4",
    companyLabel: "\ud68c\uc0ac\uba85",
    contactNameLabel: "\ub2f4\ub2f9\uc790\uba85",
    emailLabel: "\uc5f0\ub77d \uc774\uba54\uc77c",
    messageLabel: "\ubb38\uc758 \ub0b4\uc6a9",
    sendInquiry: "\ubb38\uc758 \ubcf4\ub0b4\uae30",
    formSending: "\uc804\uc1a1 \uc911...",
    formSuccess: "\uc804\uc1a1 \uc644\ub8cc! \ube60\ub974\uac8c \uc5f0\ub77d\ub4dc\ub9ac\uaca0\uc2b5\ub2c8\ub2e4.",
    contactFast: "LINE\uc73c\ub85c \ube60\ub978 \uc5f0\ub77d",
    formFailed: "\uc804\uc1a1 \uc2e4\ud328, \ub2e4\uc2dc \uc2dc\ub3c4\ud574\uc8fc\uc138\uc694.",
    retry: "\ub2e4\uc2dc \uc2dc\ub3c4",
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
  const [lockerError, setLockerError] = useState(false);
  const [concertsLoading, setConcertsLoading] = useState(true);
  const [lockersLoading, setLockersLoading] = useState(true);
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

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
    const timer = setTimeout(() => setConcertsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchLockers = async () => {
      try {
        if (mounted && lockers.length === 0) setLockersLoading(true);
        const response = await fetch("/api/lockers", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("LOCKER_FETCH_FAILED");
        }
        const json: LockerApiResponse = await response.json();
        if (mounted) {
          setLockers(json.data);
          setLockerError(false);
          setLockersLoading(false);
        }
      } catch {
        if (mounted) {
          setLockers([]);
          setLockerError(true);
          setLockersLoading(false);
        }
      }
    };

    fetchLockers();
    const interval = setInterval(fetchLockers, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [lockers.length]);

  const lockerDecision = (ratio: number) => {
    if (ratio > 0.45) return { label: text.goNow, cls: "bg-emerald-100 text-emerald-700" };
    if (ratio > 0.12) return { label: text.hurry, cls: "bg-amber-100 text-amber-700" };
    return { label: text.noSeat, cls: "bg-rose-100 text-rose-700" };
  };

  const handlePartnershipSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("sending");
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      company: String(formData.get("company") ?? ""),
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      _subject: "Jinam partnership inquiry",
    };

    try {
      const response = await fetch("https://formspree.io/f/mdalgwdq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("FORM_SUBMIT_FAILED");
      }

      setFormState("success");
      event.currentTarget.reset();
    } catch (error) {
      setFormState("error");
      setFormError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-10 pt-5 md:px-8">
      <header className="sticky top-3 z-30 mb-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[#FF2E63]">Jinam</p>
            <h1 className={`text-xl font-bold text-[#1D2742] ${textTracking}`}>{text.heroLead}</h1>
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

      <section className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="surface-card p-3 text-sm font-semibold text-[#1D2742]">{text.featureToday}</div>
        <div className="surface-card p-3 text-sm font-semibold text-[#1D2742]">{text.featureLocker}</div>
        <div className="surface-card p-3 text-sm font-semibold text-[#1D2742]">{text.featureLine}</div>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
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

        <a href="#partnership-form" className="surface-card flex items-center justify-between p-4 transition hover:-translate-y-0.5">
          <div>
            <p className="text-xs font-semibold text-[#4B587C]">Business</p>
            <p className="text-sm font-bold text-[#1D2742]">{text.quickPartnership}</p>
          </div>
          <span className="rounded-full bg-[#1D2742] px-2 py-1 text-xs font-semibold text-white">Go</span>
        </a>
      </section>

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
              <button
                key={venue}
                onClick={() => setFilter(venue)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? "text-white" : "text-[#1D2742]"
                }`}
              >
                {active ? <span className="absolute inset-0 rounded-full bg-[#FF2E63]" /> : null}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
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
                className={`surface-card group block p-4 ring-1 ${posterToneRingClass[concert.posterTone]} transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]`}
              >
              <div className="mb-3 flex items-start gap-3">
                <div
                  className={`flex h-20 w-16 shrink-0 items-end rounded-xl bg-gradient-to-b p-2 text-[10px] font-bold text-white ${posterToneClass[concert.posterTone]}`}
                >
                  {concert.artist}
                </div>
                <div className="min-w-0 flex-1">
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
                  <p className="text-sm text-[#4B587C]">
                    {formatDate(concert.date, locale)} · {concert.startTime}
                  </p>
                </div>
              </div>

              <div className="mb-3 rounded-xl border border-[#E8ECF7] bg-[#F8FAFE] p-2">
                <p className="text-xs font-semibold text-[#1D2742]">{text.liveState}</p>
                <p className="text-xs text-[#4B587C]">
                  {concert.state.goodsStatus} / {concert.state.crowdLevel}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="rounded-lg border border-[#DCE3F2] bg-white px-3 py-2 text-center text-xs font-semibold text-[#1D2742]">
                  {text.detail}
                </span>
                <span className="rounded-lg bg-[#1D2742] px-3 py-2 text-center text-xs font-semibold text-white">
                  {text.ticket}
                </span>
              </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="locker" className="surface-card p-4">
        <div className="mb-3 flex items-center gap-2 text-[#1D2742]">
          <Warehouse className="h-5 w-5" />
          <div>
            <h2 className={`text-lg font-bold ${textTracking}`}>{text.lockerTitle}</h2>
            <p className={`text-xs text-[#4B587C] ${textTracking}`}>{text.lockerDesc}</p>
          </div>
        </div>

        {lockersLoading ? (
          <div>
            <p className="mb-3 text-xs text-[#4B587C]">{text.loadingLockers}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="rounded-xl border border-[#E2E8F5] bg-[#F9FBFF] p-3">
                  <div className="skeleton mb-2 h-4 w-2/3 rounded" />
                  <div className="skeleton h-8 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
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

                <p className="mb-2 text-xs font-semibold text-[#1D2742]">{text.lockerDecisionTitle}</p>
                <p className={`mb-2 rounded-lg px-2 py-1 text-xs font-semibold ${lockerDecision(ratio).cls}`}>
                  {lockerDecision(ratio).label}
                </p>
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
        )}
        {lockerError ? <p className="mt-3 text-xs text-red-500">{text.loadError}</p> : null}
      </section>

      <section className="surface-card mt-6 p-4">
        <div className="mb-3">
          <h2 className={`text-lg font-bold text-[#1D2742] ${textTracking}`}>{text.miniGuide}</h2>
          <p className={`text-xs text-[#4B587C] ${textTracking}`}>{text.miniGuideDesc}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {(concerts as Concert[]).slice(0, 3).map((concert) => (
            <div key={concert.id} className="rounded-xl border border-[#E2E8F5] bg-[#F9FBFF] p-3">
              <p className="text-sm font-bold text-[#1D2742]">{concert.artist}</p>
              <p className="mt-1 text-xs text-[#4B587C]">• {concert.miniGuide.entryTip}</p>
              <p className="mt-1 text-xs text-[#4B587C]">• {concert.miniGuide.lastTrainTip}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="partnership-form" className="surface-card mt-6 p-4">
        <div className="mb-3">
          <h2 className={`text-lg font-bold text-[#1D2742] ${textTracking}`}>{text.partnerTitle}</h2>
          <p className={`text-xs text-[#4B587C] ${textTracking}`}>{text.partnerDesc}</p>
        </div>

        <form onSubmit={handlePartnershipSubmit} className="grid grid-cols-1 gap-3">

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
            disabled={formState === "sending"}
            className="mt-1 w-full rounded-lg bg-[#1D2742] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#121a30] disabled:opacity-50"
          >
            {formState === "sending" ? text.formSending : text.sendInquiry}
          </button>

          {formState === "success" ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-sm font-semibold text-emerald-700">{text.formSuccess}</p>
              <a
                href={(concerts as Concert[])[0]?.lineOpenChatUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex rounded-lg bg-[#06C755] px-3 py-2 text-xs font-semibold text-white"
              >
                {text.contactFast}
              </a>
            </div>
          ) : null}

          {formState === "error" ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
              <p className="text-sm font-semibold text-rose-700">{text.formFailed}</p>
              <p className="mt-1 text-xs text-rose-600">{formError}</p>
              <button
                type="button"
                onClick={() => setFormState("idle")}
                className="mt-2 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                {text.retry}
              </button>
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}
