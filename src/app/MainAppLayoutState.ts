import { Dispatch, SetStateAction } from "react";

export interface MainAppLayoutState {
  apiOnline: boolean;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  showSettings: boolean;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
  showDebugDetails: boolean;
  setShowDebugDetails: Dispatch<SetStateAction<boolean>>;
}