import type { SavedReviewReport } from "../models/review-report";
import ReviewReportView from "../components/review-report-view";

type ReviewPageProps = {
  report: SavedReviewReport;
};

export default function ReviewPage({ report }: ReviewPageProps) {
  return <ReviewReportView report={report} />;
}
