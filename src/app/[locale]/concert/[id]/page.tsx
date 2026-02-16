import { Link } from "@/i18n/navigation";
import { NOTION_TIPS_URL } from "@/constants/links";
import CopyAddressButton from "@/components/ui/copy-address-button";
import { getConcertById, getConcerts } from "@/lib/concerts";
import { getDDay } from "@/lib/utils/dday";
import type { SupportedLocale } from "@/types/concert";
import { ExternalLink, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" | "tw"; id: string }>;
};

function formatDate(date: string, locale: SupportedLocale) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return locale === "ko" ? `${y}.${m}.${day}` : `${y}/${m}/${day}`;
}

export function generateStaticParams() {
  return getConcerts().flatMap((concert) => [{ locale: "ko", id: concert.id }, { locale: "zh-TW", id: concert.id }]);
}

export default async function ConcertDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const normalizedLocale: SupportedLocale = locale === "ko" ? "ko" : "tw";
  const concert = getConcertById(id);
  if (!concert) notFound();

  const title = normalizedLocale === "ko" ? concert.title.ko : concert.title.zh;
  const helper = normalizedLocale === "ko" ? concert.title.zh : concert.title.ko;
  const dDay = getDDay(concert.date.start);
  const ticketUrl = concert.links.global ?? concert.links.kr;
  const notionUrl = NOTION_TIPS_URL[normalizedLocale];
  const activeLocale = normalizedLocale === "tw" ? "zh-TW" : "ko";

  return (
    <main className="mx-auto min-h-screen max-w-[760px] bg-[#F5F7FB] px-4 pb-24 pt-4">
      <div className="relative mb-4 h-64 overflow-hidden rounded-2xl">
        <Image src={concert.images.poster} alt={title} fill sizes="(max-width: 768px) 100vw, 760px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-xs uppercase tracking-wide opacity-90">{concert.category}</p>
          <h1 className="mt-1 text-2xl font-extrabold">{title}</h1>
          <p className="mt-1 text-sm opacity-90">{helper}</p>
        </div>
      </div>

      <section className="mb-4 rounded-2xl border border-[#E2E8F5] bg-white p-4">
        <p className="text-sm text-[#4B587C]">
          {formatDate(concert.date.start, normalizedLocale)} - {formatDate(concert.date.end, normalizedLocale)} · {concert.date.time}
        </p>
        <p className="mt-1 text-sm font-semibold text-[#1D2742]">{concert.venue.name} / {concert.venue.room}</p>
        <p className="mt-2 inline-flex rounded-full bg-[#FF2E63]/10 px-2 py-1 text-xs font-bold text-[#FF2E63]">{dDay <= 0 ? "D-Day" : `D-${dDay}`}</p>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {ticketUrl ? (
            <a href={ticketUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#1D2742] px-3 py-2 text-center text-sm font-semibold text-white">
              購票
            </a>
          ) : (
            <span className="rounded-xl bg-[#EEF1F8] px-3 py-2 text-center text-sm font-semibold text-[#4B587C]">敬請期待</span>
          )}

          {concert.links.lineChat ? (
            <a href={concert.links.lineChat} target="_blank" rel="noreferrer" className="rounded-xl border border-[#DCE3F2] bg-white px-3 py-2 text-center text-sm font-semibold text-[#1D2742]">
              <MessageCircle className="mr-1 inline h-4 w-4" />
              加入 LINE 聊天室
            </a>
          ) : (
            <span className="rounded-xl border border-[#DCE3F2] bg-white px-3 py-2 text-center text-sm font-semibold text-[#9AA3B8]">LINE 即將推出</span>
          )}

          <CopyAddressButton address="서울특별시 송파구 올림픽로 424" />
        </div>
      </section>

      <section className="mb-4 rounded-2xl border border-[#E2E8F5] bg-white p-4">
        <h2 className="text-sm font-bold text-[#1D2742]">Mini Guide</h2>
        <p className="mt-2 text-sm text-[#4B587C]">공연장 동선, 지하철 막차, 대기줄 동선 등은 운영 데이터 연결 후 자동 반영됩니다.</p>
      </section>

      <footer className="rounded-2xl border border-[#E2E8F5] bg-white p-4">
        <a href={notionUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[#DCE3F2] bg-white px-3 py-2 text-xs font-semibold text-[#1D2742]">
          Travel Tips (Notion)
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <div className="mt-3">
          <Link href="/" locale={activeLocale} className="text-xs font-semibold text-[#3A8DED]">
            ← Back to home
          </Link>
        </div>
      </footer>
    </main>
  );
}
