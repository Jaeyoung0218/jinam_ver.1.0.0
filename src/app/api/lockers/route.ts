import { NextResponse } from "next/server";

const stations = [
  { id: "olympic-park", name: "Olympic Park Station", total: 20 },
  { id: "mongchontoseong", name: "Mongchontoseong Station", total: 18 },
];

function createAvailable(total: number): number {
  const ratio = Math.random();
  if (ratio > 0.7) return Math.floor(total * 0.6 + Math.random() * total * 0.35);
  if (ratio > 0.35) return Math.floor(total * 0.25 + Math.random() * total * 0.3);
  return Math.floor(Math.random() * (total * 0.2));
}

export async function GET() {
  const data = stations.map((station) => {
    const available = Math.max(0, Math.min(station.total, createAvailable(station.total)));
    return {
      ...station,
      available,
      updatedAt: new Date().toISOString(),
    };
  });

  return NextResponse.json({ data });
}
