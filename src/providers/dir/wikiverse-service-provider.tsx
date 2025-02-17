import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LoadingBar } from "../../components";
import { WikiverseServiceRequestPayload, WikiverseService } from "../../types";

interface ServiceProviderProps {
  useLocalAPI?: boolean;
  children: ReactNode;
}

// Time the requestError state is maintained before being cleaned up
const REQUEST_ERROR_TIMEOUT = 820;

const WikiverseApiContext = createContext<WikiverseService | undefined>(
  undefined
);

/**
 * Provide Access and State related to the backend Wikiverse API.
 */
export const WikiverseServiceProvider = ({
  useLocalAPI = false,
  children,
}: ServiceProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // check API status on mount
    checkServiceAvailability();
  }, []);

  /**
   * Helper to designate the request URL endpoint based on provided useLocalAPI (for dev) state.
   */
  const BASE_URL = useLocalAPI
    ? "http://localhost:8080/api"
    : "https://wikiverse-api-main-febfewcbf3avfffh.canadacentral-01.azurewebsites.net/api";

  /**
   * Reports the error to the dev console for investigation and toggles state
   * according to the @var REQUEST_ERROR_TIMEOUT in the @see WikiverseServiceProvider.
   */
  function handleBadResponse(err: any) {
    console.error("handleBadResponse(): ", err);
    setRequestError(true);

    setTimeout(() => {
      // cleanup requestError state
      setRequestError(false);
    }, REQUEST_ERROR_TIMEOUT);
  }

  /**
   * @method checkServiceAvailability()
   * Tests if the Wikiverse Service is online and updates relavant state with the response.
   * @returns A promise that resolves to a boolean indicating the service availability.
   */
  const checkServiceAvailability = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/current-status`).finally(() =>
        setIsLoading(false)
      );
      console.log("checkServiceAvailability(): ", response);
      if (!response.ok) setIsOnline(false);
    } catch (error) {
      handleBadResponse(error);
      setIsOnline(false);
    }
  }, []);

  /**
   * @method getQueryData()
   * Makes the initial request to the Wikiverse Service used to initialize a new @see P5Sketch
   * @param query - The query string to initialize the sketch.
   * @returns A promise that resolves to a Response object.
   */
  const getNewQueryData = useCallback(async (query: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/query-data?${new URLSearchParams({ query }).toString()}`
      ).finally(() => setIsLoading(false));
      return await response.json();
    } catch (error) {
      handleBadResponse(error);
    }
  }, []);

  /**
   * @method makePostRequest()
   * Requests data for topics related to the provided target topic.
   * @param tgt - The target string for which related data is requested.
   * @param data - The payload containing the request data.
   * @returns A promise that resolves to a Response object.
   */
  const makePostRequest = useCallback(
    async (tgt: string, data: WikiverseServiceRequestPayload) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/${tgt}`,
          formatPostRequestPayload(data)
        ).finally(() => {
          setIsLoading(false);
        });
        return await response.json();
      } catch (error) {
        handleBadResponse(error);
      }
    },
    []
  );

  /**
   * @method formatPostRequestPayload()
   * Helper util which format's the payload data for the @see Fetch api to properly send a POST request
   *
   * @param {WikiverseServiceRequestPayload} data - the data to send to the backend API
   */
  function formatPostRequestPayload(data: WikiverseServiceRequestPayload) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  }

  /**
   * @method getTutorialStep()
   * Requests  the needed data for a particular (@var tgt) step in the tutorial
   * @param tgt - The target string for the tutorial part (e.g., "1").
   * @returns A promise that resolves to a Response object.
   */
  const getTutorialStep = useCallback(async (target: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/tutorial?${new URLSearchParams({ target }).toString()}`
      ).finally(() => setIsLoading(false));
      return await response.json();
    } catch (error) {
      handleBadResponse(error);
    }
  }, []);

  // Memoize Context to prevent internal loading-state from updating and re-rendering all
  const ctxValue = useMemo(
    () => ({
      isOnline,
      requestError,
      checkServiceAvailability,
      getNewQueryData,
      makePostRequest,
      getTutorialStep,
    }),
    [
      isOnline,
      requestError,
      checkServiceAvailability,
      getNewQueryData,
      makePostRequest,
      getTutorialStep,
    ]
  );

  return (
    <WikiverseApiContext.Provider value={ctxValue}>
      <LoadingBar {...{ isLoading }} />
      {children}
    </WikiverseApiContext.Provider>
  );
};

export const useWikiverseService = (): WikiverseService => {
  const context = useContext(WikiverseApiContext);
  if (!context) {
    throw new Error(
      "useWikiverseApi() error, must be used inside of the WikiverseApiProvider context component"
    );
  }
  return context;
};
