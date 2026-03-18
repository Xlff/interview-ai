import { notFound } from "next/navigation";
import PrepPackPage from "@/features/prep-pack/views/prep-pack-page";
import { getOrCreatePrepPack } from "@/server/repositories/prep-pack-repository";

type PrepPackRouteProps = {
  params: Promise<{
    jobTargetId: string;
  }>;
};

export default async function PrepPackRoute({ params }: PrepPackRouteProps) {
  const { jobTargetId } = await params;
  const prepPack = await getOrCreatePrepPack(jobTargetId);

  if (!prepPack) {
    notFound();
  }

  return <PrepPackPage prepPack={prepPack} />;
}
