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
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="h-56 w-full bg-slate-200">
        {imageUrl ? (
          <Image src={imageUrl} alt={titleKo} width={1200} height={800} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="text-xs text-slate-500">{dateLabel}</div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{titleKo}</h2>
          {titleZhTw ? <p className="text-sm text-slate-600">{titleZhTw}</p> : null}
        </div>
        <div className="text-sm text-slate-600">
          {venueKo}
          {venueZhTw ? <span className="ml-1 text-slate-500">({venueZhTw})</span> : null}
          <span className="mx-1">·</span>
          {startTime}
          {typeof minPrice === "number" ? (
            <span className="ml-1 text-slate-500">· From ₩{minPrice.toLocaleString()}</span>
          ) : null}
        </div>

        <div className="mt-2 flex gap-2">
          <Link
            href={`/concerts/${id}`}
            locale={locale}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            티켓 예매하기（訂票）
          </Link>
          <Link
            href={`/services/luggage?concertId=${id}`}
            locale={locale}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            짐 보관·이동
          </Link>
        </div>
      </div>
    </article>
  );
}
