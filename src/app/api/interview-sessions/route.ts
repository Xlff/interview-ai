import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateLocalUserByEmail } from "@/server/repositories/auth-user-repository";
import {
  createFocusedRetryInterviewSession,
  createInterviewSession,
} from "@/server/repositories/interview-session-repository";

type InterviewSessionRequest = {
  jobTargetId?: string;
  sourceSessionId?: string;
  focusDimensions?: string[];
  providerId?: string;
  model?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as InterviewSessionRequest;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const localUser = user?.email ? await getOrCreateLocalUserByEmail(user.email) : null;

  if (!payload.jobTargetId && !payload.sourceSessionId) {
    return NextResponse.json(
      { error: "jobTargetId or sourceSessionId is required" },
      { status: 400 },
    );
  }

  const llmOptions = {
    providerId: payload.providerId,
    model: payload.model,
  };
  const session = payload.sourceSessionId
    ? await createFocusedRetryInterviewSession(
        payload.sourceSessionId,
        llmOptions,
        localUser?.id,
      )
    : await createInterviewSession(payload.jobTargetId!, llmOptions, {
        userId: localUser?.id,
        focusDimensions: payload.focusDimensions,
      });

  if (!session) {
    return NextResponse.json(
      { error: "interview session could not be created" },
      { status: 404 },
    );
  }

  return NextResponse.json(session, { status: 201 });
}
