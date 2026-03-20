import { notFound } from "next/navigation";
import InterviewPage from "@/features/interview/views/interview-page";
import { getInterviewSessionById } from "@/server/repositories/interview-session-repository";

type InterviewRouteProps = {
  params: Promise<{
    sessionId: string;
  }>;
  searchParams: Promise<{
    provider?: string;
    model?: string;
  }>;
};

export default async function InterviewRoute({ params, searchParams }: InterviewRouteProps) {
  const { sessionId } = await params;
  const { provider, model } = await searchParams;
  const session = await getInterviewSessionById(sessionId);

  if (!session) {
    notFound();
  }

  return <InterviewPage initialSession={session} providerId={provider} model={model} />;
}
