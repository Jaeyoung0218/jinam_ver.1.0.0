"use client";

import type { Concert, SupportedLocale } from "@/types/concert";
import { useMemo, useState } from "react";
import ConcertCard from "./concert-card";
import DatePicker from "./date-picker";
import LinePromoCard from "./line-promo-card";
import LanguageToggle from "@/components/ui/language-toggle";
import BottomNav from "@/components/ui/bottom-nav";
import { MapPinned } from "lucide-react";
import Link from "next/link";

type Props = {
  initialData: Concert[];
  locale: SupportedLocale;
};

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function ConcertDashboard({ initialData, locale }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [roomFilter, setRoomFilter] = useState<"all" | "KSPO DOME" | "Handball" | "Olympic Hall">("all");

  const filteredConcerts = useMemo(() => {
    const byDay = initialData.filter((concert) => sameDay(new Date(concert.date.start), selectedDate));
    if (roomFilter === "all") return byDay;
    return byDay.filter((concert) => concert.venue.room === roomFilter);
  }, [initialData, selectedDate, roomFilter]);

  return (
    <div className="min-h-screen bg-[#F5F7FB] pb-28 transition-all duration-200">
      <header className="sticky top-0 z-40 border-b border-[#E2E8F5] bg-white/95 p-4 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">Jinam 指南</h1>
          <LanguageToggle locale={locale} />
        </div>
        <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} localeLabel={locale} days={90} />
      </header>

      <main className="space-y-4 p-4">
        <LinePromoCard
          title={locale === "ko" ? "대만 팬 전용 LINE 오픈챗" : "台灣粉絲專用 LINE 聊天室"}
          subtitle={locale === "ko" ? "현장 상황 & 티켓 정보 공유" : "現場狀況與票券資訊分享"}
          chatUrl={initialData[0]?.links.lineChat}
        />

        <div className="flex gap-2 overflow-x-auto">
          {["all", "KSPO DOME", "Handball", "Olympic Hall"].map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => setRoomFilter(room as "all" | "KSPO DOME" | "Handball" | "Olympic Hall")}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${
                roomFilter === room ? "border-[#1D2742] bg-[#1D2742] text-white" : "border-[#DCE3F2] bg-white text-[#1D2742]"
              }`}
            >
              {room === "all" ? "All" : room}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredConcerts.map((concert, index) => (
            <ConcertCard key={concert.id} data={concert} locale={locale} priority={index < 2} />
          ))}
          {filteredConcerts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCE3F2] bg-white p-6 text-center text-sm text-[#6E7B9A]">
              {locale === "ko" ? "선택한 날짜의 공연이 없습니다." : "此日期沒有演唱會資料。"}
            </div>
          ) : null}
        </div>
      </main>

      <Link href={`/${locale === "tw" ? "zh-TW" : "ko"}/survival`} className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#1D2742] px-4 py-2 text-xs font-bold text-white shadow-lg">
        <MapPinned className="h-4 w-4" />
        Survival Map
      </Link>
      <BottomNav locale={locale} />
    </div>
  );
}
