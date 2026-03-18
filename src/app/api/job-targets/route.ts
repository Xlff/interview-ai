import { NextResponse } from "next/server";
import type { JobTargetInput } from "@/features/job-target/models/job-target";
import { validateJobTargetInput } from "@/features/job-target/view-models/use-job-target-form";
import { createJobTarget } from "@/server/repositories/job-target-repository";
import { analyzeJobDescription } from "@/server/services/jd-analysis-service";

export async function POST(request: Request) {
  const payload = (await request.json()) as JobTargetInput;
  const validation = validateJobTargetInput(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const draft = analyzeJobDescription(payload);
  const savedJobTarget = await createJobTarget(payload.rawJD.trim(), draft);

  return NextResponse.json(savedJobTarget, { status: 201 });
}
