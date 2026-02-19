import { CalendarDays, Camera, Ellipsis, Map } from "lucide-react";
import Link from "next/link";
import { NOTION_SURVIVAL_MAP_URL } from "@/constants/links";

type BottomNavProps = {
  active: "concerts" | "live" | "more";
};

const tabBaseClass = "group flex flex-col items-center gap-1 transition-colors duration-200";

function iconClass(isActive: boolean) {
  return isActive ? "h-[18px] w-[18px] text-[#3A8DED]" : "h-[18px] w-[18px] text-gray-500";
}

function labelClass(isActive: boolean) {
  return isActive ? "text-[10px] font-semibold text-[#1D2742]" : "text-[10px] font-semibold text-gray-500";
}

function iconWrapClass(isActive: boolean) {
  return isActive
    ? "flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2FF]"
    : "flex h-8 w-8 items-center justify-center rounded-full";
}

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8ECF4] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[74px] max-w-[430px] items-center justify-around px-2">
        <Link href="/" aria-pressed={active === "concerts"} className={tabBaseClass}>
          <span className={iconWrapClass(active === "concerts")}>
            <CalendarDays className={iconClass(active === "concerts")} />
          </span>
          <span className={labelClass(active === "concerts")}>演唱會</span>
        </Link>

        <Link href="/live" aria-pressed={active === "live"} className={tabBaseClass}>
          <span className={iconWrapClass(active === "live")}>
            <Camera className={iconClass(active === "live")} />
          </span>
          <span className={labelClass(active === "live")}>現場實況</span>
        </Link>

        <a href={NOTION_SURVIVAL_MAP_URL} target="_blank" rel="noreferrer" className={tabBaseClass}>
          <span className={iconWrapClass(false)}>
            <Map className={iconClass(false)} />
          </span>
          <span className={labelClass(false)}>生存地圖</span>
        </a>

        <Link href="/guide" aria-pressed={active === "more"} className={tabBaseClass}>
          <span className={iconWrapClass(active === "more")}>
            <Ellipsis className={iconClass(active === "more")} />
          </span>
          <span className={labelClass(active === "more")}>更多</span>
        </Link>
      </div>
    </nav>
  );
}
