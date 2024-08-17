import { IApiStatus, IVertex, IEdge, IProperty, IFetchQueue } from ".";
import { IDimensions } from ".";

export interface ISessionData {
  query: string | undefined;
  dimensions: IDimensions;
  apiStatus: IApiStatus;
  vertices: IVertex[] | undefined;
  edges: IEdge[] | undefined;
  properties: IProperty[] | undefined;
  queue: IFetchQueue | undefined;
}