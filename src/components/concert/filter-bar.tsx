"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  venueOptions: Array<{ value: string; label: string }>;
  sortOptions: Array<{ value: "date_asc" | "date_desc"; label: string }>;
  labels: {
    date: string;
    venue: string;
    sort: string;
    reset: string;
  };
};

export default function FilterBar({ venueOptions, sortOptions, labels }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const date = searchParams.get("date") ?? "";
  const venue = searchParams.get("venue") ?? "";
  const sort = (searchParams.get("sort") as "date_asc" | "date_desc" | null) ?? "date_asc";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetParams = () => {
    router.push(pathname);
  };

  return (
    <section className="rounded-3xl border border-[#E2E8F5] bg-white p-3 shadow-[0_8px_20px_rgba(29,39,66,0.05)]">
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs font-semibold text-[#4B587C]">
          {labels.date}
          <input
            type="date"
            value={date}
            onChange={(e) => updateParam("date", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-[#DCE3F2] bg-[#F8FAFF] px-2.5 py-2 text-xs text-[#1D2742]"
          />
        </label>

        <label className="text-xs font-semibold text-[#4B587C]">
          {labels.venue}
          <select
            value={venue}
            onChange={(e) => updateParam("venue", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-[#DCE3F2] bg-[#F8FAFF] px-2.5 py-2 text-xs text-[#1D2742]"
          >
            {venueOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-[#4B587C]">
          {labels.sort}
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-[#DCE3F2] bg-[#F8FAFF] px-2.5 py-2 text-xs text-[#1D2742]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={resetParams}
            className="w-full rounded-xl border border-[#DCE3F2] bg-white px-3 py-2 text-xs font-semibold text-[#1D2742]"
          >
            {labels.reset}
          </button>
        </div>
      </div>
    </section>
  );
}
