import { WikiverseServiceRequestPayload } from "./wikiverse-service-request-payload";
import { WikiverseServiceResponse } from "./wikiverse-service-response";

/**
 * Interface representing the totality of state and requests available through
 * the Wikiverse Service API.
 */
export interface WikiverseService {
  /**
   * Indicates if the Wikiverse Service is online.
   */
  isOnline: boolean;

  /**
   * Indicates if there was an error with the request.
   */
  requestError: boolean;

  /**
   * Tests if the Wikiverse Service is online.
   * @returns A promise that resolves to a boolean indicating the service availability.
   */
  checkServiceAvailability: () => Promise<void>;

  /**
   * Makes the initial request to the Wikiverse Service used to initialize a new @see P5Sketch
   * @param query - The query string to initialize the sketch.
   * @returns A promise that resolves to a Response object.
   */
  getNewQueryData: (query: string) => Promise<WikiverseServiceResponse>;

  /**
   * Make's a POST request to the provided URL target, POST requests require payload data.
   * @param tgt - The target string for which related data is requested.
   * @param data - The payload containing the request data.
   * @returns A promise that resolves to a Response object.
   */
  makePostRequest: (
    tgt: string,
    data: WikiverseServiceRequestPayload
  ) => Promise<WikiverseServiceResponse>;

  /**
   * Requests  the needed data for a particular (@var tgt) step in the tutorial
   * @param tgt - The target string for the tutorial part (e.g., "1").
   * @returns A promise that resolves to a Response object.
   */
  getTutorialStep: (tgt: string) => Promise<WikiverseServiceResponse>;
}
