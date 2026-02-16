import { NOTION_SURVIVAL_MAP_URL } from "@/constants/links";
import { CalendarDays, Camera, Ellipsis, Map } from "lucide-react";
import Link from "next/link";

type BottomNavProps = {
  active: "concerts" | "live" | "more";
};

const tabClass = "flex flex-col items-center gap-1";
const activeClass = "text-[#1D2742]";
const inactiveClass = "text-gray-500 opacity-60";

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8ECF4] bg-white">
      <div className="mx-auto flex h-20 max-w-[760px] items-center justify-around px-2">
        <Link href="/" aria-pressed={active === "concerts"} className={`${tabClass} ${active === "concerts" ? activeClass : inactiveClass}`}>
          <CalendarDays className="h-5 w-5" />
          <span className="text-[10px] font-bold">演唱會</span>
        </Link>

        <Link href="/live" aria-pressed={active === "live"} className={`${tabClass} ${active === "live" ? activeClass : inactiveClass}`}>
          <Camera className="h-5 w-5" />
          <span className="text-[10px] font-bold">現場實況</span>
        </Link>

        <a href={NOTION_SURVIVAL_MAP_URL} target="_blank" rel="noreferrer" className={`${tabClass} ${inactiveClass}`}>
          <Map className="h-5 w-5" />
          <span className="text-[10px] font-bold">生存地圖</span>
        </a>

        <Link href="/guide" aria-pressed={active === "more"} className={`${tabClass} ${active === "more" ? activeClass : inactiveClass}`}>
          <Ellipsis className="h-5 w-5" />
          <span className="text-[10px] font-bold">更多</span>
        </Link>
      </div>
    </nav>
  );
}
