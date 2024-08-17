import { IEdge, IFetchQueue, IPoint3D } from '.';

export interface ISessionPayload {
  vertices: IVert[];
  edges: IEdge[];
  properties: IProp[];
  queue: IFetchQueue;
}

// Condensed versions to mitigate uneeded data transmission
interface IVert {
  id: string;
  coords: IPoint3D;
}

interface IProp {
  id: string;
}