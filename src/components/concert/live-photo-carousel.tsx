"use client";

import type { Performance } from "@/types/performance";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  items: Performance[];
  locale: "ko" | "zh-TW";
};

export default function LivePhotoCarousel({ items, locale }: Props) {
  const images = useMemo(
    () =>
      items
        .filter((item) => item.poster_url)
        .map((item) => ({
          id: item.id,
          src: item.poster_url as string,
          title: locale === "ko" ? item.title_ko : item.title_zh_tw ?? item.title_ko,
          venue: locale === "ko" ? item.venue?.name_ko : item.venue?.name_zh_tw,
          date: item.start_date,
        })),
    [items, locale],
  );

  const [index, setIndex] = useState(0);
  const active = images[index];

  const onPrev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const onNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <section className="rounded-2xl border border-[#E2E8F5] bg-white p-6 text-center">
        <h2 className="text-base font-bold text-[#1D2742]">{locale === "ko" ? "오늘의 현장 사진" : "今日現場照片"}</h2>
        <p className="mt-2 text-sm text-[#6E7B9A]">
          {locale === "ko" ? "오늘 공연 이미지가 아직 없습니다." : "今天的演出圖片尚未上傳。"}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#E2E8F5] bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-lg font-extrabold text-[#1D2742]">{locale === "ko" ? "실시간 현장 업데이트" : "實時現場更新"}</h2>
        <p className="text-xs font-semibold text-[#6E7B9A]">
          {index + 1} / {images.length}
        </p>
      </div>

      <div className="relative h-[440px] overflow-hidden rounded-xl bg-[#E8EDF8]">
        <Image src={active.src} alt={active.title} fill sizes="(max-width: 768px) 100vw, 760px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-extrabold">{active.title}</h3>
          <p className="mt-1 text-sm opacity-95">{active.venue ?? "-"}</p>
          <p className="text-xs opacity-90">{active.date}</p>
        </div>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}
