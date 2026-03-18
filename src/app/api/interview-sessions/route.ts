import { NextResponse } from "next/server";
import { createInterviewSession } from "@/server/repositories/interview-session-repository";

type InterviewSessionRequest = {
  jobTargetId?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as InterviewSessionRequest;

  if (!payload.jobTargetId) {
    return NextResponse.json(
      { error: "jobTargetId is required" },
      { status: 400 },
    );
  }

  const session = await createInterviewSession(payload.jobTargetId);

  if (!session) {
    return NextResponse.json(
      { error: "job target not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(session, { status: 201 });
}
