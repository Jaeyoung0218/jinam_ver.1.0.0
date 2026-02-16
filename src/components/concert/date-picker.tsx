"use client";

type Props = {
  selectedDate: Date;
  onChange: (date: Date) => void;
  days?: number;
  localeLabel: "ko" | "tw";
};

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDay(date: Date, localeLabel: "ko" | "tw") {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return localeLabel === "ko" ? `${m}.${d}` : `${m}/${d}`;
}

export default function DatePicker({ selectedDate, onChange, days = 60, localeLabel }: Props) {
  const today = new Date();
  const items = Array.from({ length: days }, (_, i) => addDays(today, i));

  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
      {items.map((date) => {
        const active = sameDay(date, selectedDate);
        const isToday = sameDay(date, today);
        return (
          <button
            key={date.toISOString()}
            type="button"
            onClick={() => onChange(date)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${
              active ? "border-[#1D2742] bg-[#1D2742] text-white" : "border-[#DCE3F2] bg-white text-[#1D2742]"
            }`}
          >
            {isToday ? (localeLabel === "ko" ? "오늘" : "今天") : formatDay(date, localeLabel)}
          </button>
        );
      })}
    </div>
  );
}
