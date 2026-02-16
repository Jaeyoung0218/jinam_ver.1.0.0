"use client";

import type { LockerPoint, RestaurantPoint } from "@/data/survival";
import { useMemo, useState } from "react";
import { MapPin, UtensilsCrossed } from "lucide-react";

type Props = {
  lockers: LockerPoint[];
  restaurants: RestaurantPoint[];
  locale: "ko" | "tw";
};

type Filter = "all" | "locker" | "food";

export default function SurvivalMapView({ lockers, restaurants, locale }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const points = useMemo(() => {
    if (filter === "locker") return lockers;
    if (filter === "food") return restaurants;
    return [...lockers, ...restaurants];
  }, [filter, lockers, restaurants]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["all", "locker", "food"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              filter === f ? "border-[#1D2742] bg-[#1D2742] text-white" : "border-[#DCE3F2] bg-white text-[#1D2742]"
            }`}
          >
            {f === "all" ? "All" : f === "locker" ? "🔒 Lockers" : "🍴 Food"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E2E8F5] bg-white p-4">
        <div className="mb-2 text-xs text-[#6E7B9A]">
          {locale === "ko" ? "지도 API 연동 전 임시 레이아웃 (Olympic Park 기준)" : "地圖 API 串接前的暫時版面（以奧林匹克公園為中心）"}
        </div>
        <div className="h-56 rounded-xl bg-[#EAF1FF]" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        {points.map((point) => (
          <div key={point.id} className="rounded-xl border border-[#E2E8F5] bg-white p-3">
            <p className="flex items-center gap-1 text-sm font-semibold text-[#1D2742]">
              {"station" in point ? <MapPin className="h-4 w-4" /> : <UtensilsCrossed className="h-4 w-4" />}
              {point.name}
            </p>
            {"station" in point ? (
              <p className="mt-1 text-xs text-[#4B587C]">{point.station} · {point.status}</p>
            ) : (
              <p className="mt-1 text-xs text-[#4B587C]">{point.tags.join(", ")} · {point.isTaiwanFriendly ? "TW Friendly" : "General"}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
