import { useState, useCallback } from 'react';
import { IApiStatusResponse, IWikidataUniverseSession } from '../interfaces';
import { calculateDrawingDimensions } from '../functions';

interface IUseSessionStateProps {
  apiStatus: IApiStatusResponse;
  wikidataApiStatus: string;
}


export const useSessionState = ({ apiStatus, wikidataApiStatus }: IUseSessionStateProps): [IWikidataUniverseSession, (key: keyof IWikidataUniverseSession, value: any) => void] => {
  const [sessionState, setSessionState] = useState<IWikidataUniverseSession>({
    originQuery: '',
    dimensions: calculateDrawingDimensions(window), // Assuming an initial value for dimensions
    apiStatus: apiStatus, // Assuming an initial value for apiStatus
    wikidataApiStatus: wikidataApiStatus,
    graphset: null, // Assuming null as an initial value for graphset
  });

  const updateSessionState = useCallback((key: keyof IWikidataUniverseSession, value: any) => {
    setSessionState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  return [sessionState, updateSessionState];
};