import { Dispatch, SetStateAction } from "react";

export interface SessionSettingsState {
  showSettings: boolean;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
  activeQuerySession: boolean;
  setActiveQuerySession: Dispatch<SetStateAction<boolean>>;
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
  useOfflineData: boolean;
  setUseOfflineData: Dispatch<SetStateAction<boolean>>;
  apiOnline: boolean;
  setApiOnline: Dispatch<SetStateAction<boolean>>;
}