import BottomNav from "@/components/ui/bottom-nav";
import { Link } from "@/i18n/navigation";
import { NOTION_SURVIVAL_MAP_URL } from "@/constants/links";
import { getKspoConcerts } from "@/lib/concerts/kspo-to-concert";
import type { Concert } from "@/types/concert";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" }>;
};

export default async function LocaleGuidePage({ params }: Props) {
  const { locale } = await params;
  const list = getKspoConcerts() as Concert[];
  const copy =
    locale === "ko"
      ? {
          title: "미니 가이드",
          subtitle: "공연 당일 체크리스트와 이동 팁",
          notion: "생존 지도 (Notion) 열기",
          entry: "입장",
          move: "이동",
          transport: "교통",
          notice: "주의",
        }
      : {
          title: "迷你指南",
          subtitle: "演唱會當日檢查清單與移動建議",
          notion: "開啟生存地圖 (Notion)",
          entry: "入場",
          move: "移動",
          transport: "交通",
          notice: "注意",
        };

  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-[#F5F7FB] px-3 pb-28 pt-4">
      <section className="surface-card p-4">
        <h1 className="text-lg font-semibold text-[#1D2742]">{copy.title}</h1>
        <p className="mt-1 text-cjk-body text-xs font-normal text-[#4B587C]">{copy.subtitle}</p>

        <a
          href={NOTION_SURVIVAL_MAP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block rounded-lg bg-[#1D2742] px-3 py-2 text-xs font-semibold text-white"
        >
          {copy.notion}
        </a>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-3">
        {list.map((concert) => (
          <Link key={concert.id} href={`/concerts/${concert.id}`} locale={locale} className="surface-card p-4">
            <h2 className="text-sm font-semibold text-[#1D2742]">{concert.artist}</h2>
            <p className="mt-1 text-cjk-body text-xs font-normal text-[#4B587C]">- {copy.entry}: {concert.miniGuide.entryTip}</p>
            <p className="mt-1 text-cjk-body text-xs font-normal text-[#4B587C]">- {copy.move}: {concert.miniGuide.lastTrainTip}</p>
            <p className="mt-1 text-cjk-body text-xs font-normal text-[#4B587C]">- {copy.transport}: {concert.miniGuide.transportTip}</p>
            <p className="mt-1 text-cjk-body text-xs font-normal text-[#4B587C]">- {copy.notice}: {concert.miniGuide.noticeTip}</p>
          </Link>
        ))}
      </section>

      <BottomNav active="more" />
    </main>
  );
}
