import { notFound } from "next/navigation";
import ReviewPage from "@/features/review/views/review-page";
import { getOrCreateReviewReport } from "@/server/repositories/review-report-repository";

type ReviewRouteProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function ReviewRoute({ params }: ReviewRouteProps) {
  const { sessionId } = await params;
  const report = await getOrCreateReviewReport(sessionId);

  if (!report) {
    notFound();
  }

  return <ReviewPage report={report} />;
}
