import { Link } from "@/i18n/navigation";
import Image from "next/image";

type Locale = "ko" | "zh-TW";

type Props = {
  locale: Locale;
  id: string;
  dateLabel: string;
  titleKo: string;
  titleZhTw?: string;
  venueKo: string;
  venueZhTw?: string;
  startTime: string;
  minPrice?: number;
  imageUrl?: string;
};

export default function EventCard({
  locale,
  id,
  dateLabel,
  titleKo,
  titleZhTw,
  venueKo,
  venueZhTw,
  startTime,
  minPrice,
  imageUrl,
}: Props) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#E2E8F5] bg-white shadow-[0_10px_24px_rgba(29,39,66,0.08)]">
      <div className="relative h-48 w-full bg-slate-200">
        {imageUrl ? (
          <Image src={imageUrl} alt={titleKo} width={1200} height={800} className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-cjk-body text-xs font-normal text-white/90">{dateLabel}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 p-4">
        <div>
          <h2 className="line-clamp-2 text-[17px] font-semibold text-slate-900">{titleKo}</h2>
          {titleZhTw ? <p className="text-cjk-body line-clamp-1 text-sm font-normal text-slate-600">{titleZhTw}</p> : null}
        </div>
        <div className="text-cjk-body text-xs font-normal text-slate-600">
          {venueKo}
          {venueZhTw ? <span className="ml-1 text-slate-500">({venueZhTw})</span> : null}
          <span className="mx-1">·</span>
          {startTime}
          {typeof minPrice === "number" ? (
            <span className="ml-1 text-slate-500">· From ₩{minPrice.toLocaleString()}</span>
          ) : null}
        </div>

        <div className="mt-1 flex gap-2">
          <Link
            href={`/concerts/${id}`}
            locale={locale}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            티켓 예매하기（訂票）
          </Link>
          <Link
            href={`/services/luggage?concertId=${id}`}
            locale={locale}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
          >
            짐 보관·이동
          </Link>
        </div>
      </div>
    </article>
  );
}
