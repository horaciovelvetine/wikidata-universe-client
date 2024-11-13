import { Dispatch, SetStateAction } from "react";
import { SketchManager, Vertex } from "../models";

export interface MainAppLayoutState {
  apiOnline: boolean;
  apiOffline: boolean;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  showSettings: boolean;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
  showDebugDetails: boolean;
  setShowDebugDetails: Dispatch<SetStateAction<boolean>>;
  showAboutSketch: boolean;
  setShowAboutSketch: Dispatch<SetStateAction<boolean>>;
  aboutSketchText: string | null;
  setAboutSketchText: Dispatch<SetStateAction<string | null>>;
  selectedVertex: Vertex | null;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  hoveredVertex: Vertex | null;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  p5SketchRef: SketchManager | null;
  setP5SketchRef: Dispatch<SetStateAction<SketchManager | null>>;
  showWikiverseSketch: boolean;
  setShowWikiverseSketch: Dispatch<SetStateAction<boolean>>;
  navStatusMessage: string | null;
  setNavStatusMessage: Dispatch<SetStateAction<string | null>>;
  showAboutSketchText: boolean;
  setShowAboutSketchText: Dispatch<SetStateAction<boolean>>;
}