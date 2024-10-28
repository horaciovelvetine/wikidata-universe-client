import { Dispatch, SetStateAction } from "react";

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
}