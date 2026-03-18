import { notFound } from "next/navigation";
import InterviewPage from "@/features/interview/views/interview-page";
import { getInterviewSessionById } from "@/server/repositories/interview-session-repository";

type InterviewRouteProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function InterviewRoute({ params }: InterviewRouteProps) {
  const { sessionId } = await params;
  const session = await getInterviewSessionById(sessionId);

  if (!session) {
    notFound();
  }

  return <InterviewPage initialSession={session} />;
}
