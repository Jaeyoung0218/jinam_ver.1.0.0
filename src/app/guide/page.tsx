import BottomNav from "@/components/bottom-nav";
import { NOTION_SURVIVAL_MAP_URL } from "@/constants/links";
import concerts from "@/data/concerts.json";
import type { Concert } from "@/types/concert";
import Link from "next/link";

export default function GuidePage() {
  const list = concerts as Concert[];

  return (
    <main className="mx-auto min-h-screen max-w-[760px] bg-[#F5F7FB] px-5 pb-28 pt-5">
      <section className="surface-card p-4">
        <h1 className="text-lg font-bold text-[#1D2742]">迷你指南</h1>
        <p className="mt-1 text-xs text-[#4B587C]">Concert day checklist and transfer tips.</p>

        <a
          href={NOTION_SURVIVAL_MAP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block rounded-lg bg-[#1D2742] px-3 py-2 text-xs font-semibold text-white"
        >
          生存地圖 (Notion) 打開
        </a>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-3">
        {list.map((concert) => (
          <Link key={concert.id} href={`/concerts/${concert.id}`} className="surface-card p-4">
            <h2 className="text-sm font-bold text-[#1D2742]">{concert.artist}</h2>
            <p className="mt-1 text-xs text-[#4B587C]">• 入場: {concert.miniGuide.entryTip}</p>
            <p className="mt-1 text-xs text-[#4B587C]">• 移動: {concert.miniGuide.lastTrainTip}</p>
            <p className="mt-1 text-xs text-[#4B587C]">• 交通: {concert.miniGuide.transportTip}</p>
            <p className="mt-1 text-xs text-[#4B587C]">• 注意: {concert.miniGuide.noticeTip}</p>
          </Link>
        ))}
      </section>

      <BottomNav active="more" />
    </main>
  );
}
