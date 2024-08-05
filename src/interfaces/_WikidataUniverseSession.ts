import { IApiStatusResponse, IVertex, IEdge, IProperty, IFetchQueue } from ".";
import { IDimensions } from ".";

export interface IWikidataUniverseSession {
  query: string;
  dimensions: IDimensions;
  apiStatus: IApiStatusResponse;
  vertices: IVertex[];
  edges: IEdge[];
  properties: IProperty[];
  fetchQueue: IFetchQueue;
}