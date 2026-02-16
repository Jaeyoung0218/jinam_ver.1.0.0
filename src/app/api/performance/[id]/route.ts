import { fetchPerformanceById } from "@/lib/performances/repository";
import { getDDay } from "@/lib/utils/dday";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const performance = await fetchPerformanceById(id);

    if (!performance) {
      return NextResponse.json(
        {
          code: "PERF_NOT_FOUND",
          message: "Performance not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: {
        ...performance,
        d_day: getDDay(performance.start_date),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: "PERF_DETAIL_FETCH_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
