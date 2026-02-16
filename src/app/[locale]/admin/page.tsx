import { fetchPerformances } from "@/lib/performances/repository";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" }>;
};

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("admin");
  const items = await fetchPerformances();

  return (
    <main className="mx-auto min-h-screen max-w-[760px] bg-[#F5F7FB] px-4 pb-8 pt-5">
      <section className="mb-4 rounded-2xl border border-[#E2E8F5] bg-white p-4">
        <h1 className="text-xl font-extrabold text-[#1D2742]">{t("title")}</h1>
        <p className="mt-1 text-xs text-[#6E7B9A]">{t("subtitle")}</p>
      </section>

      <section className="grid grid-cols-1 gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-[#E2E8F5] bg-white p-4">
            <p className="text-sm font-bold text-[#1D2742]">{locale === "ko" ? item.title_ko : item.title_zh_tw ?? item.title_ko}</p>
            <p className="mt-1 text-xs text-[#4B587C]">
              KO: {item.title_ko} / TW: {item.title_zh_tw ?? "-"}
            </p>
            <p className="mt-1 text-xs text-[#4B587C]">Status: {item.status}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">{t("approve")}</button>
              <button className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white">{t("hold")}</button>
              <button className="rounded-lg border border-[#DCE3F2] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D2742]">{t("edit")}</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
