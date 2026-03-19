import { NextResponse } from "next/server";
import { getOrCreatePrepPack } from "@/server/repositories/prep-pack-repository";

type PrepPackRequest = {
  jobTargetId?: string;
  providerId?: string;
  model?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as PrepPackRequest;

  if (!payload.jobTargetId) {
    return NextResponse.json(
      {
        error: "jobTargetId is required",
      },
      { status: 400 },
    );
  }

  const prepPack = await getOrCreatePrepPack(payload.jobTargetId, {
    providerId: payload.providerId,
    model: payload.model,
  });

  if (!prepPack) {
    return NextResponse.json(
      {
        error: "job target not found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(prepPack, { status: 200 });
}
