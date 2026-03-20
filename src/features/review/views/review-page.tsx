import type { SavedReviewReport } from "../models/review-report";
import ReviewReportView from "../components/review-report-view";

type ReviewPageProps = {
  report: SavedReviewReport;
  providerId?: string;
  model?: string;
};

export default function ReviewPage({ report, providerId, model }: ReviewPageProps) {
  return <ReviewReportView report={report} providerId={providerId} model={model} />;
}
