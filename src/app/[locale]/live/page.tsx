import BottomNav from "@/components/ui/bottom-nav";
import liveUpdates from "@/data/live-updates.json";
import type { SupportedLocale } from "@/types/concert";
import { CalendarClock } from "lucide-react";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" | "tw" }>;
};

type LiveItem = {
  id: string;
  title: string;
  location: string;
  summary: string;
  updatedAt: string;
  tags: string[];
  tone: "sky" | "amber" | "emerald" | "indigo";
};

const toneClass: Record<LiveItem["tone"], string> = {
  sky: "from-sky-300 to-cyan-500",
  amber: "from-amber-300 to-orange-500",
  emerald: "from-emerald-300 to-teal-500",
  indigo: "from-indigo-300 to-blue-600",
};

export default async function LivePage({ params }: Props) {
  const { locale } = await params;
  const normalizedLocale: SupportedLocale = locale === "ko" ? "ko" : "tw";
  const items = liveUpdates as LiveItem[];

  return (
    <main className="mx-auto min-h-screen max-w-[760px] bg-[#F5F7FB] px-4 pb-28 pt-4 transition-all duration-200">
      <section className="mb-4 rounded-2xl border border-[#E7EAF1] bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold text-[#1D2742]">{normalizedLocale === "ko" ? "현장 실황" : "現場實況"}</h1>
        <p className="mt-1 text-xs text-[#6E7B9A]">{normalizedLocale === "ko" ? "현장 제보와 업데이트를 빠르게 확인하세요." : "快速查看現場回報與更新。"}</p>
      </section>

      <div className="grid grid-cols-1 gap-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-xl border border-[#E7EAF1] bg-white">
            <div className={`h-24 w-full bg-gradient-to-r ${toneClass[item.tone]}`} />
            <div className="p-3">
              <h2 className="text-sm font-bold text-[#1D2742]">{item.title}</h2>
              <p className="mt-1 text-xs text-[#4B587C]">{item.location}</p>
              <p className="mt-2 text-xs text-[#4B587C]">{item.summary}</p>
              <p className="mt-2 flex items-center gap-1 text-[10px] text-[#7D8AA9]">
                <CalendarClock className="h-3 w-3" />
                {new Date(item.updatedAt).toLocaleString(normalizedLocale === "ko" ? "ko-KR" : "zh-TW")}
              </p>
            </div>
          </article>
        ))}
      </div>

      <BottomNav locale={normalizedLocale} />
    </main>
  );
}
