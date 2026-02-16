import BottomNav from "@/components/ui/bottom-nav";
import { NOTION_TIPS_URL } from "@/constants/links";
import type { SupportedLocale } from "@/types/concert";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" | "tw" }>;
};

export default async function TipsPage({ params }: Props) {
  const { locale } = await params;
  const normalizedLocale: SupportedLocale = locale === "ko" ? "ko" : "tw";
  const notionUrl = NOTION_TIPS_URL[normalizedLocale];

  return (
    <main className="mx-auto min-h-screen max-w-[760px] bg-[#F5F7FB] px-4 pb-28 pt-4">
      <section className="rounded-2xl border border-[#E2E8F5] bg-white p-4">
        <h1 className="text-xl font-extrabold text-[#1D2742]">{normalizedLocale === "ko" ? "여행 팁" : "旅行小貼士"}</h1>
        <p className="mt-2 text-sm text-[#4B587C]">
          {normalizedLocale === "ko"
            ? "공연장 이동 동선, 막차, 주변 식당 정보를 정리했습니다."
            : "整理了演唱會動線、末班車與周邊餐廳資訊。"}
        </p>
        <a href={notionUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-lg bg-[#1D2742] px-4 py-2 text-sm font-semibold text-white">
          Open Notion Guide
        </a>
      </section>

      <BottomNav locale={normalizedLocale} />
    </main>
  );
}
