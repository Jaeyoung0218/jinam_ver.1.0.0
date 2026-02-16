"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { SupportedLocale } from "@/types/concert";

type Props = {
  locale: SupportedLocale;
};

export default function LanguageToggle({ locale }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (nextLocale: SupportedLocale) => {
    router.replace(pathname, { locale: nextLocale === "tw" ? "zh-TW" : "ko" });
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#DCE3F2] bg-white p-1">
      <button
        type="button"
        onClick={() => switchLocale("ko")}
        className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === "ko" ? "bg-[#1D2742] text-white" : "text-[#1D2742]"}`}
      >
        KO
      </button>
      <button
        type="button"
        onClick={() => switchLocale("tw")}
        className={`rounded-full px-3 py-1 text-xs font-semibold ${locale === "tw" ? "bg-[#1D2742] text-white" : "text-[#1D2742]"}`}
      >
        TW
      </button>
    </div>
  );
}
