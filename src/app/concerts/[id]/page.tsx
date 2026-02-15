import concerts from "@/data/concerts.json";
import type { Concert } from "@/types/concert";
import { CalendarDays, Clock3, MapPin, MessageCircle, Store, Train } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function toLocaleDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function generateStaticParams() {
  const list = concerts as Concert[];
  return list.map((item) => ({ id: item.id }));
}

export default async function ConcertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concert = (concerts as Concert[]).find((item) => item.id === id);
  if (!concert) notFound();

  const crowdTone =
    concert.state.crowdLevel.toLowerCase() === "safe"
      ? "border-emerald-200 bg-emerald-50"
      : concert.state.crowdLevel.toLowerCase() === "normal"
        ? "border-sky-200 bg-sky-50"
        : concert.state.crowdLevel.toLowerCase() === "busy"
          ? "border-amber-200 bg-amber-50"
          : "border-rose-200 bg-rose-50";

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 pb-10 pt-6 md:px-8">
      <header className="mb-4 rounded-2xl border border-[#E2E8F5] bg-white p-4 shadow-sm">
        <Link href="/" className="text-xs font-semibold text-[#4B587C]">
          ← Back to home
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#1D2742]">{concert.artist}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-[#DCE3F2] bg-[#F8FAFE] px-2 py-1 text-[#1D2742]">
            DATE: {toLocaleDate(concert.date)} {concert.startTime}
          </span>
          <span className="rounded-full border border-[#DCE3F2] bg-[#F8FAFE] px-2 py-1 text-[#1D2742]">VENUE: {concert.venue}</span>
          <span className="rounded-full border border-[#DCE3F2] bg-[#F8FAFE] px-2 py-1 text-[#1D2742]">TAGS: MD / Crowd / LINE</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
          <a
            href={concert.lineOpenChatUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[#E2E8F5] bg-[#F8FFF8] px-3 py-2 text-center text-sm font-semibold text-[#06C755]"
          >
            <MessageCircle className="mr-1 inline h-4 w-4" />
            LINE Open Chat Join
          </a>
          <a
            href={concert.ticketUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-[#1D2742] px-3 py-2 text-center text-sm font-semibold text-white"
          >
            Book the ticket
          </a>
          <Link href="/#partnership-form" className="rounded-xl border border-[#E2E8F5] bg-white px-3 py-2 text-center text-sm font-semibold text-[#1D2742]">
            Partnership inquiry
          </Link>
        </div>
      </header>

      <section className={`mb-4 rounded-2xl border p-4 shadow-sm ${crowdTone}`}>
        <h2 className="mb-3 text-lg font-bold text-[#1D2742]">Real-time state view</h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-xl border border-white/70 bg-white/70 p-3">
            <p className="mb-1 text-xs font-semibold text-[#4B587C]">On-site manager update</p>
            <p className="text-sm font-bold text-[#1D2742]">{concert.state.note}</p>
            <p className="mt-2 text-xs text-[#4B587C]">Updated: {new Date(concert.state.updatedAt).toLocaleString("ko-KR")}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/70 bg-white/70 p-3">
              <p className="flex items-center gap-1 text-sm font-semibold text-[#1D2742]">
                <Store className="h-4 w-4" />
                Goods status
              </p>
              <p className="mt-1 text-sm text-[#4B587C]">{concert.state.goodsStatus}</p>
            </div>
            <div className="rounded-xl border border-white/70 bg-white/70 p-3">
              <p className="text-sm font-semibold text-[#1D2742]">Crowd level</p>
              <p className="mt-1 text-sm text-[#4B587C]">{concert.state.crowdLevel}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4 rounded-2xl border border-[#E2E8F5] bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-[#1D2742]">Mini guide</h2>
        <div className="grid grid-cols-1 gap-2">
          <p className="flex items-start gap-2 rounded-lg bg-[#F8FAFE] px-3 py-2 text-sm text-[#1D2742]">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#4B587C]" />
            <span>
              <span className="mb-0.5 block text-xs font-semibold text-[#4B587C]">入場</span>
              {concert.miniGuide.entryTip}
            </span>
          </p>
          <p className="flex items-start gap-2 rounded-lg bg-[#F8FAFE] px-3 py-2 text-sm text-[#1D2742]">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#4B587C]" />
            <span>
              <span className="mb-0.5 block text-xs font-semibold text-[#4B587C]">移動</span>
              {concert.miniGuide.lastTrainTip}
            </span>
          </p>
          <p className="flex items-start gap-2 rounded-lg bg-[#F8FAFE] px-3 py-2 text-sm text-[#1D2742]">
            <Train className="mt-0.5 h-4 w-4 shrink-0 text-[#4B587C]" />
            <span>
              <span className="mb-0.5 block text-xs font-semibold text-[#4B587C]">交通 / 地鐵</span>
              {concert.miniGuide.transportTip}
            </span>
          </p>
          <p className="flex items-start gap-2 rounded-lg bg-[#F8FAFE] px-3 py-2 text-sm text-[#1D2742]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4B587C]" />
            <span>
              <span className="mb-0.5 block text-xs font-semibold text-[#4B587C]">注意事項</span>
              {concert.miniGuide.noticeTip}
            </span>
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E2E8F5] bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-[#1D2742]">Locker Widget</h2>
        <p className="text-sm text-[#4B587C]">
          Check nearby locker availability in real time from the home screen widget. Filter by status to find the fastest option.
        </p>
        <Link href="/#locker" className="mt-3 inline-flex rounded-lg bg-[#1D2742] px-3 py-2 text-sm font-semibold text-white">
          Go to locker widget
        </Link>
      </section>
    </main>
  );
}
