import BottomNav from "@/components/bottom-nav";
import liveUpdates from "@/data/live-updates.json";
import { CalendarClock, Filter, Search } from "lucide-react";

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

export default function LivePage() {
  const items = liveUpdates as LiveItem[];

  return (
    <main className="mx-auto min-h-screen max-w-[1024px] bg-[#F5F7FB] px-5 pb-28 pt-5">
      <section className="rounded-2xl border border-[#E7EAF1] bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#1D2742]">📸 現場實況</h1>
          <div className="flex items-center gap-3 text-[#6E7B9A]">
            <Filter className="h-4 w-4" />
            <Search className="h-4 w-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-xl border border-[#E7EAF1] bg-white">
              <div className={`h-28 w-full bg-gradient-to-r ${toneClass[item.tone]}`} />
              <div className="p-3">
                <h2 className="text-sm font-bold text-[#1D2742]">{item.title}</h2>
                <p className="mt-1 text-xs text-[#4B587C]">{item.location}</p>
                <p className="mt-2 text-xs text-[#4B587C]">{item.summary}</p>

                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded bg-[#FFF4E8] px-1.5 py-0.5 text-[10px] text-[#8B5E2B]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="mt-2 flex items-center gap-1 text-[10px] text-[#7D8AA9]">
                  <CalendarClock className="h-3 w-3" />
                  {new Date(item.updatedAt).toLocaleString("zh-TW")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <BottomNav active="live" />
    </main>
  );
}
