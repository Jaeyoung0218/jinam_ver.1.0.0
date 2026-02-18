import BottomNav from "@/components/ui/bottom-nav";
import LivePhotoCarousel from "@/components/concert/live-photo-carousel";
import { fetchPerformances } from "@/lib/performances/repository";
import { getKstNow } from "@/lib/utils/dday";

export default async function LivePage() {
  const list = await fetchPerformances();
  const today = getKstNow().toISOString().slice(0, 10);
  const todayPerformances = list.filter((item) => item.start_date === today);

  return (
    <main className="mx-auto min-h-screen max-w-[1024px] bg-[#F5F7FB] px-5 pb-28 pt-5 transition-all duration-200">
      <LivePhotoCarousel items={todayPerformances} locale="zh-TW" />

      <BottomNav active="live" />
    </main>
  );
}
