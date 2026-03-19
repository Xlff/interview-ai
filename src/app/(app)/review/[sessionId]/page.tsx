import { notFound } from "next/navigation";
import ReviewPage from "@/features/review/views/review-page";
import { getOrCreateReviewReport } from "@/server/repositories/review-report-repository";

type ReviewRouteProps = {
  params: Promise<{
    sessionId: string;
  }>;
  searchParams: Promise<{
    provider?: string;
    model?: string;
  }>;
};

export default async function ReviewRoute({ params, searchParams }: ReviewRouteProps) {
  const { sessionId } = await params;
  const { provider, model } = await searchParams;
  const report = await getOrCreateReviewReport(sessionId, {
    providerId: provider,
    model,
  });

  if (!report) {
    notFound();
  }

  return <ReviewPage report={report} providerId={provider} model={model} />;
}
