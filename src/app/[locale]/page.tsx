import ConcertDashboard from "@/components/concert/concert-dashboard";
import { getConcerts } from "@/lib/concerts";
import type { SupportedLocale } from "@/types/concert";

type Props = {
  params: Promise<{ locale: "ko" | "zh-TW" | "tw" }>;
};

export default async function LocalizedDashboardPage({ params }: Props) {
  const { locale } = await params;
  const normalizedLocale: SupportedLocale = locale === "ko" ? "ko" : "tw";
  return <ConcertDashboard initialData={getConcerts()} locale={normalizedLocale} />;
}
