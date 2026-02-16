"use client";

import { useEffect, useMemo, useState } from "react";

type LockerItem = {
  id: string;
  name: string;
  total: number;
  available: number;
  updatedAt: string;
};

type LockerResponse = {
  data: LockerItem[];
  updatedAt?: string;
};

type Props = {
  lineUrl?: string;
  locale: "ko" | "zh-TW";
};

const DISTANCE_TO_KSPO: Record<string, number> = {
  "olympic-park": 0.6,
  mongchontoseong: 1.1,
};

export default function LockerWidget({ lineUrl, locale }: Props) {
  const [data, setData] = useState<LockerItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [sortByDistance, setSortByDistance] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch("/api/lockers", { cache: "no-store" });
        if (!response.ok) throw new Error("LOCKER_API_FAILED");
        const json = (await response.json()) as LockerResponse;
        if (!mounted) return;
        setData(json.data);
        setLastUpdated(json.updatedAt ?? json.data[0]?.updatedAt ?? new Date().toISOString());
        setIsError(false);
      } catch {
        if (!mounted) return;
        setIsError(true);
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 30_000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const sortedData = useMemo(() => {
    if (!sortByDistance) return data;
    return [...data].sort((a, b) => (DISTANCE_TO_KSPO[a.id] ?? 999) - (DISTANCE_TO_KSPO[b.id] ?? 999));
  }, [data, sortByDistance]);

  return (
    <section id="locker" className="surface-card mb-6 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#1D2742]">🔒 Locker Status</h2>
        <button
          type="button"
          onClick={() => setSortByDistance((prev) => !prev)}
          className="rounded-full border border-[#DCE3F2] px-3 py-1 text-[11px] font-semibold text-[#1D2742]"
        >
          {locale === "ko" ? "KSPO 거리순" : "距離 KSPO 排序"}
        </button>
      </div>

      <p className="mb-3 text-xs text-[#6E7B9A]">
        Last updated:{" "}
        {lastUpdated
          ? new Date(lastUpdated).toLocaleTimeString(locale === "ko" ? "ko-KR" : "zh-TW", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--:--"}
      </p>

      {isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
          <p className="text-xs font-semibold text-rose-700">
            {locale === "ko" ? "락커 API를 불러오지 못했습니다." : "無法取得置物櫃 API 資料。"}
          </p>
          {lineUrl ? (
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex rounded-lg bg-[#06C755] px-3 py-1.5 text-xs font-bold text-white"
            >
              在 LINE 詢問最新狀況
            </a>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {sortedData.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#E2E8F5] bg-[#F9FBFF] p-3">
              <p className="text-xs font-semibold text-[#1D2742]">{item.name}</p>
              <p className="mt-1 text-xs text-[#4B587C]">
                {item.available}/{item.total}
                {sortByDistance ? ` · ${DISTANCE_TO_KSPO[item.id] ?? "-"}km` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
