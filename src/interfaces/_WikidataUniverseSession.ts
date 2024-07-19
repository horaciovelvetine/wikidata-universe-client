import { IApiStatusResponse } from ".";
import { IDimensions } from ".";

export interface IWikidataUniverseSession {
  originalQuery: string;
  Dimesnions: IDimensions;
  apiStatus: IApiStatusResponse;
  wikidataApiStatus: string;
  Graphset: any;
}