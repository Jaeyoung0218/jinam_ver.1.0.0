export function getKstNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
}

export function getDDay(startDate: string, now = getKstNow()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const target = new Date(`${startDate}T00:00:00+09:00`);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}
