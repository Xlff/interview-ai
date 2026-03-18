import type { InterviewSessionSnapshot } from "../models/interview-session";
import InterviewChat from "../components/interview-chat";

type InterviewPageProps = {
  initialSession: InterviewSessionSnapshot;
};

export default function InterviewPage({ initialSession }: InterviewPageProps) {
  return <InterviewChat initialSession={initialSession} />;
}
