import { IApiStatusResponse } from ".";
import { IDimensions } from ".";

export interface IWikidataUniverseSession {
  originQuery: string;
  dimensions: IDimensions;
  apiStatus: IApiStatusResponse;
  wikidataApiStatus: string;
  graphset: any;
}