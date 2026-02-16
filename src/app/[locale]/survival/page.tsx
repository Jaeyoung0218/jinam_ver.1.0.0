import BottomNav from "@/components/ui/bottom-nav";
import LockerStatusPanel from "@/components/map/locker-status-panel";
import SurvivalMapView from "@/components/map/survival-map-view";
import { getConcerts } from "@/lib/concerts";
import { lockers, restaurants } from "@/data/survival";
import type { SupportedLocale } from "@/types/concert";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" | "tw" }>;
};

export default async function SurvivalPage({ params }: Props) {
  const { locale } = await params;
  const normalizedLocale: SupportedLocale = locale === "ko" ? "ko" : "tw";
  const lineUrl = getConcerts()[0]?.links.lineChat;

  return (
    <main className="mx-auto min-h-screen max-w-[760px] bg-[#F5F7FB] px-4 pb-28 pt-4">
      <h1 className="mb-3 text-xl font-extrabold text-[#1D2742]">{normalizedLocale === "ko" ? "생존 지도" : "生存地圖"}</h1>

      <SurvivalMapView lockers={lockers} restaurants={restaurants} locale={normalizedLocale} />

      <div className="mt-4">
        <LockerStatusPanel locale={normalizedLocale} lineUrl={lineUrl} />
      </div>

      <BottomNav locale={normalizedLocale} />
    </main>
  );
}
