import PrepPackView from "../components/prep-pack-view";
import type { SavedPrepPack } from "../models/prep-pack";

type PrepPackPageProps = {
  prepPack: SavedPrepPack;
};

export default function PrepPackPage({ prepPack }: PrepPackPageProps) {
  return <PrepPackView prepPack={prepPack} />;
}
