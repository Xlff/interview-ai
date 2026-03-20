import { notFound } from "next/navigation";
import PrepPackPage from "@/features/prep-pack/views/prep-pack-page";
import { getOrCreatePrepPack } from "@/server/repositories/prep-pack-repository";

type PrepPackRouteProps = {
  params: Promise<{
    jobTargetId: string;
  }>;
  searchParams: Promise<{
    provider?: string;
    model?: string;
  }>;
};

export default async function PrepPackRoute({ params, searchParams }: PrepPackRouteProps) {
  const { jobTargetId } = await params;
  const { provider, model } = await searchParams;
  const prepPack = await getOrCreatePrepPack(jobTargetId, {
    providerId: provider,
    model,
  });

  if (!prepPack) {
    notFound();
  }

  return <PrepPackPage prepPack={prepPack} providerId={provider} model={model} />;
}
