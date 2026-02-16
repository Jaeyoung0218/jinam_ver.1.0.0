"use client";

import { Link, usePathname } from "@/i18n/navigation";
import type { SupportedLocale } from "@/types/concert";
import { CalendarDays, Camera, Compass, MapPinned } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  locale: SupportedLocale;
};

const tabs = [
  { key: "home", href: "/", label: "Home", icon: CalendarDays },
  { key: "live", href: "/live", label: "Live", icon: Camera },
  { key: "map", href: "/survival", label: "Map", icon: MapPinned },
  { key: "tips", href: "/tips", label: "Tips", icon: Compass },
] as const;

export default function BottomNav({ locale }: Props) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8ECF4] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[760px] items-center justify-around px-2">
        {tabs.map((tab) => {
          const active = pathname === `/${locale === "tw" ? "zh-TW" : "ko"}${tab.href === "/" ? "" : tab.href}`;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              locale={locale === "tw" ? "zh-TW" : "ko"}
              className={`relative flex flex-col items-center gap-1 px-2 ${active ? "text-[#1D2742]" : "text-[#7C889F]"}`}
            >
              {active ? <motion.span layoutId="nav-active-pill" className="absolute -top-1 h-1.5 w-7 rounded-full bg-[#3A8DED]" /> : null}
              <Icon className={`h-5 w-5 ${active ? "text-[#3A8DED]" : ""}`} />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
