"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

const SUPPORTED_LOCALES = ["ko", "zh-TW"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

type Props = {
  current: SupportedLocale;
};

export default function LanguageToggle({ current }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const switchLocale = (nextLocale: SupportedLocale) => {
    const query = Object.fromEntries(searchParams.entries());
    if (Object.keys(query).length === 0) {
      router.replace(pathname, { locale: nextLocale });
      return;
    }
    router.replace({ pathname, query }, { locale: nextLocale });
  };

  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1">
      {SUPPORTED_LOCALES.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1 text-xs font-medium ${
            current === locale ? "rounded-full bg-white text-slate-900 shadow" : "text-slate-500"
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
