"use client";

import { Link } from "@/i18n/navigation";
import { getDDay } from "@/lib/utils/dday";
import type { Concert, SupportedLocale } from "@/types/concert";
import { CalendarClock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  data: Concert;
  locale: SupportedLocale;
  priority?: boolean;
};

function formatDate(value: string, locale: SupportedLocale) {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return locale === "ko" ? `${y}.${m}.${day}` : `${y}/${m}/${day}`;
}

export default function ConcertCard({ data, locale, priority }: Props) {
  const dDay = getDDay(data.date.start);
  const title = locale === "ko" ? data.title.ko : data.title.zh;
  const ticketLabel = data.links.global ? "購票 (WorldNol)" : data.links.kr ? "購票 (YES24)" : "敬請期待";
  const ticketUrl = data.links.global ?? data.links.kr;
  const nextLocale = locale === "tw" ? "zh-TW" : "ko";

  return (
    <motion.article whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} className="relative overflow-hidden rounded-2xl border border-[#E2E8F5] bg-white shadow-sm">
      <div className="relative h-56 w-full">
        <Image src={data.images.poster} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority={priority} />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-[#FF2E63]">{dDay <= 0 ? "D-Day" : `D-${dDay}`}</div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-90">{data.category}</p>
          <h3 className="mt-1 text-xl font-extrabold leading-tight">{title}</h3>
          <p className="mt-1 text-sm opacity-95">{data.artist}</p>
        </div>
      </div>

      <div className="space-y-2 p-3">
        <p className="flex items-center gap-1 text-sm text-[#4B587C]">
          <MapPin className="h-4 w-4" />
          {data.venue.room}
        </p>
        <p className="flex items-center gap-1 text-sm text-[#4B587C]">
          <CalendarClock className="h-4 w-4" />
          {formatDate(data.date.start, locale)} · {data.date.time}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <Link href={`/concert/${data.id}`} locale={nextLocale} className="rounded-lg border border-[#DCE3F2] bg-white px-3 py-2 text-xs font-semibold text-[#1D2742]">
            View Detail
          </Link>
          {ticketUrl ? (
            <a href={ticketUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-[#1D2742] px-3 py-2 text-xs font-semibold text-white">
              {ticketLabel}
            </a>
          ) : (
            <span className="rounded-lg bg-[#EEF1F8] px-3 py-2 text-xs font-semibold text-[#4B587C]">{ticketLabel}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
