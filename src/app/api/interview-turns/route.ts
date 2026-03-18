import { NextResponse } from "next/server";
import { answerCurrentInterviewTurn } from "@/server/repositories/interview-session-repository";

type InterviewTurnRequest = {
  sessionId?: string;
  userAnswer?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as InterviewTurnRequest;

  if (!payload.sessionId || !payload.userAnswer?.trim()) {
    return NextResponse.json(
      { error: "sessionId and userAnswer are required" },
      { status: 400 },
    );
  }

  const session = await answerCurrentInterviewTurn(payload.sessionId, payload.userAnswer);

  if (!session) {
    return NextResponse.json(
      { error: "interview session not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(session, { status: 200 });
}
