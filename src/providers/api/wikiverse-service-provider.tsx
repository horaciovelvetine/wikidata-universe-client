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

/**
 * Time in milliseconds the requestError state is maintained before being cleaned up
 * @constant {number}
 */
const REQUEST_ERROR_TIMEOUT = 820;

/**
 * Context for providing Wikiverse API services throughout the application
 * @type {React.Context<WikiverseService | undefined>}
 */
const WikiverseApiContext: React.Context<WikiverseService | undefined> =
  createContext<WikiverseService | undefined>(undefined);

/**
 * Props for the WikiverseServiceProvider component
 * @interface ServiceProviderProps
 * @property {boolean} [useLocalAPI=false] - Flag to use local API endpoint instead of production
 * @property {ReactNode} children - Child components to render
 */
interface ServiceProviderProps {
  useLocalAPI?: boolean;
  children: ReactNode;
}

/**
 * Provider component that manages access and state related to the Wikiverse API.
 * Provides API requests, maintains loading state, and initial error logging.
 *
 * @param {ServiceProviderProps} props - Component props
 * @returns {JSX.Element} Provider component with LoadingBar and children
 */
export const WikiverseServiceProvider = ({
  useLocalAPI = false,
  children,
}: ServiceProviderProps): JSX.Element => {
  // Internal State
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  /**
   * Base URL for API requests, determined by useLocalAPI flag
   * @type {string}
   */
  const BASE_URL: string = useLocalAPI
    ? "http://localhost:8080/api"
    : "https://wikiverse-api-main-febfewcbf3avfffh.canadacentral-01.azurewebsites.net/api";

  /**
   * Reports errors to the console and manages error state
   * @param {any} err - The error that occurred
   */
  const handleBadResponse = (err: any) => {
    console.error("handleBadResponse(): ", err);
    setRequestError(true);
    setTimeout(() => {
      setRequestError(false);
    }, REQUEST_ERROR_TIMEOUT);
  };

  /**
   * Tests if the Wikiverse Service is online and updates relevant state
   * @returns {Promise<void>} A promise that resolves when the check is complete
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
  }, [BASE_URL]);

  /**
   * Makes the initial request to the Wikiverse Service for a new query
   * @param {string} query - The query string to initialize the sketch
   * @returns {Promise<any>} A promise that resolves to the response data
   */
  const getNewQueryData = useCallback(
    async (query: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/query-data?${new URLSearchParams({ query }).toString()}`
        ).finally(() => setIsLoading(false));
        const json = await response.json();
        console.log("getQueryDataResponse()", json);
        return json;
      } catch (error) {
        handleBadResponse(error);
      }
    },
    [BASE_URL]
  );

  /**
   * Formats the payload data for POST requests
   * @param {WikiverseServiceRequestPayload} data - The data to send to the backend API
   * @returns {Object} Formatted request options for fetch
   */
  const formatPostRequestPayload = (
    data: WikiverseServiceRequestPayload
  ): object => {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  };

  /**
   * Makes a POST request to the specified endpoint with the provided payload
   * @param {string} tgt - The target endpoint
   * @param {WikiverseServiceRequestPayload} data - The payload containing the request data
   * @returns {Promise<any>} A promise that resolves to the response data
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
        const json = await response.json();
        console.log(`makePostRequest(${tgt}):`, json);
        return json;
      } catch (error) {
        handleBadResponse(error);
      }
    },
    [BASE_URL]
  );

  /**
   * Requests data for a specific tutorial step
   * @param {string} target - The target step identifier (e.g., "1")
   * @returns {Promise<any>} A promise that resolves to the tutorial step data
   */
  const getTutorialStep = useCallback(
    async (target: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/tutorial?${new URLSearchParams({ target }).toString()}`
        ).finally(() => setIsLoading(false));
        const json = await response.json();
        console.log(`getTutorialStep(${target})`, json);
        return json;
      } catch (error) {
        handleBadResponse(error);
      }
    },
    [BASE_URL]
  );

  // Check API status on mount (assumes true to prevent initial UI flash, and optimism is cool)
  useEffect(() => {
    checkServiceAvailability();
  }, [checkServiceAvailability]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
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
    <WikiverseApiContext.Provider value={contextValue}>
      <LoadingBar isLoading={isLoading} />
      {children}
    </WikiverseApiContext.Provider>
  );
};

/**
 * Custom hook to access the WikiverseService context
 * @returns {WikiverseService} The WikiverseService context value
 * @throws {Error} If used outside of WikiverseApiProvider
 */
export const useWikiverseService = (): WikiverseService => {
  const context = useContext(WikiverseApiContext);
  if (!context) {
    throw new Error(
      "useWikiverseApi() error, must be used inside of the WikiverseApiProvider context component"
    );
  }
  return context;
};
