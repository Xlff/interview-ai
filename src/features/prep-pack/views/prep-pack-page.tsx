import PrepPackView from "../components/prep-pack-view";
import type { SavedPrepPack } from "../models/prep-pack";

type PrepPackPageProps = {
  prepPack: SavedPrepPack;
  providerId?: string;
  model?: string;
};

export default function PrepPackPage({ prepPack, providerId, model }: PrepPackPageProps) {
  return <PrepPackView prepPack={prepPack} providerId={providerId} model={model} />;
}
