import { getNotionSurvivalMapUrl } from "@/constants/links";

type Props = {
  locale: "ko" | "zh-TW";
};

export default function SurvivalMapFab({ locale }: Props) {
  return (
    <a
      href={getNotionSurvivalMapUrl(locale)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#1D2742] px-4 py-2 text-xs font-semibold text-white shadow-lg"
    >
      🗺 Survival Map
    </a>
  );
}
