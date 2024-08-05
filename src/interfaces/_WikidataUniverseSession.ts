import { IApiStatusResponse, IVertex, IEdge, IProperty, IFetchQueue } from ".";
import { IDimensions } from ".";

export interface IWikidataUniverseSession {
  query: string | undefined;
  dimensions: IDimensions;
  apiStatus: IApiStatusResponse;
  vertices: IVertex[] | undefined;
  edges: IEdge[] | undefined;
  properties: IProperty[] | undefined;
  fetchQueue: IFetchQueue | undefined;
}