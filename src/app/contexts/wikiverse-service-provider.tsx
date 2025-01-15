import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { iDimensions, iEdge, iProperty, iVertex, LayoutConfig } from '../../types';
import { LoadingBar } from '../../components';

interface WikiverseServiceProviderProps {
  useLocalAPI?: boolean;
  children: ReactNode;
}

export interface WikiverseServiceRequestPayload {
  query: string;
  dimensions: iDimensions;
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
  layoutConfig: LayoutConfig;
}

export interface WikiverseServiceResponse {
  query: string;
  dimensions: iDimensions;
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
  layoutConfig: LayoutConfig;
  err: any;
}

interface ServiceProvider {
  getQueryData: (query: string) => Promise<WikiverseServiceResponse>;
  post: (tgt: string, data: WikiverseServiceRequestPayload) => Promise<WikiverseServiceResponse>;
  isOnline: boolean;
  checkServiceAvailability: () => Promise<boolean>;
}

const WikiverseApiContext = createContext<ServiceProvider | undefined>(undefined);

export const WikiverseServiceProvider: FC<WikiverseServiceProviderProps> = ({ children, useLocalAPI = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => { // check API status on mount (assumes offline by default)
    checkServiceAvailability();
  });


  const baseUrl = useLocalAPI ? "http://localhost:8080/api/" : "https://wikiverse-api-main-febfewcbf3avfffh.canadacentral-01.azurewebsites.net/api/";
  const INV_STATUS_TXT = (status: number) => `HTTP error, invalid status ${status}`

  const postPayload = (data: WikiverseServiceRequestPayload) => {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  }


  /**
   * @method getQueryData() - makes the initial request to the Wikiverse Service which then initializes a QuerySketch
   */
  const getQueryData = useCallback(async (query: string): Promise<WikiverseServiceResponse> => {
    setIsLoading(true);

    const response = await fetch(`${baseUrl}query-data?${new URLSearchParams({ query }).toString()}`).finally(() => setIsLoading(false))

    if (!response.ok) {
      console.log(INV_STATUS_TXT(response.status), response)
      throw new Error(INV_STATUS_TXT(response.status))
    }

    const json: WikiverseServiceResponse = await response.json();
    console.log(`getQueryData(${query}) response:`, json);
    return json;
  }, [baseUrl]);

  /**
   * @method post() - generically access the API for a request (called inside of the p5 sketches mostly)
   * 
   */
  const post = useCallback(async (tgt: string, data: WikiverseServiceRequestPayload): Promise<WikiverseServiceResponse> => {
    setIsLoading(true);

    const response = await fetch(baseUrl + tgt, postPayload(data)).finally(() => setIsLoading(false));

    if (!response.ok) {
      console.log(INV_STATUS_TXT(response.status), response);
      throw new Error(INV_STATUS_TXT(response.status));
    }

    const json = await response.json();
    console.log(`post(${tgt}) response:`, json);
    return json;
  }, [baseUrl]);

  /**
   * @method checkServiceAvailability() - sends a request to the Wikiverse API to check if it's online and updates relevant state
   */
  const checkServiceAvailability = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}current-status`).finally(() => setIsLoading(false));

    if (!response.ok) {
      console.log(INV_STATUS_TXT(response.status))
      setIsOnline(false);
      return false;
    } else {
      console.log('checkServiceAvailability():', await response.json())
      setIsOnline(true);
      return true;
    }
  }, [baseUrl]);

  const ctxValue = useMemo(() => ({
    getQueryData, post, isOnline, checkServiceAvailability
  }), [getQueryData, post, isOnline, checkServiceAvailability])

  return (
    <WikiverseApiContext.Provider value={ctxValue}>
      <LoadingBar {...{ isLoading }} />
      {children}
    </WikiverseApiContext.Provider>);
}

export const useWikiverseService = (): ServiceProvider => {
  const context = useContext(WikiverseApiContext);
  if (!context) {
    throw new Error('useWikiverseApi() error, must be used inside of the WikiverseApiProvider context component');
  }
  return context;
}