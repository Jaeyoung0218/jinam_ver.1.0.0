import { MessageCircle } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  chatUrl?: string;
};

export default function LinePromoCard({ title, subtitle, chatUrl }: Props) {
  return (
    <div className="rounded-2xl bg-[#22C55E] p-4 text-white shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-1 text-xs opacity-90">{subtitle}</p>
        </div>
        {chatUrl ? (
          <a href={chatUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#22C55E]">
            <MessageCircle className="h-3.5 w-3.5" />
            LINE
          </a>
        ) : (
          <span className="rounded-full bg-white/20 px-3 py-2 text-xs font-bold">即將推出</span>
        )}
      </div>
    </div>
  );
}
