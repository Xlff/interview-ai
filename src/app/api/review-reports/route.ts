import { NextResponse } from "next/server";
import { getOrCreateReviewReport } from "@/server/repositories/review-report-repository";

type ReviewReportRequest = {
  sessionId?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as ReviewReportRequest;

  if (!payload.sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 },
    );
  }

  const report = await getOrCreateReviewReport(payload.sessionId);

  if (!report) {
    return NextResponse.json(
      { error: "review report not available" },
      { status: 404 },
    );
  }

  return NextResponse.json(report, { status: 200 });
}
