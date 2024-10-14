import { Dispatch, SetStateAction } from "react";

export interface SessionSettingsState {
  showDebugDetails: boolean;
  setShowDebugDetails: Dispatch<SetStateAction<boolean>>;
  showUnfetchedVertices: boolean;
  setShowUnfetchedVertices: Dispatch<SetStateAction<boolean>>;
  showMedianAxis: boolean;
  setShowMedianAxis: Dispatch<SetStateAction<boolean>>;
  showMedianBoundBox: boolean;
  setShowMedianBoundBox: Dispatch<SetStateAction<boolean>>;
  showDimensionBoundBox: boolean;
  setShowDimensionBoundBox: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}