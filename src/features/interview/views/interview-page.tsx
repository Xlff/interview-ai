import type { InterviewSessionSnapshot } from "../models/interview-session";
import InterviewChat from "../components/interview-chat";

type InterviewPageProps = {
  initialSession: InterviewSessionSnapshot;
  providerId?: string;
  model?: string;
};

export default function InterviewPage({ initialSession, providerId, model }: InterviewPageProps) {
  return <InterviewChat initialSession={initialSession} providerId={providerId} model={model} />;
}
