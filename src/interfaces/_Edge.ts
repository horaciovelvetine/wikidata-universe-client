export interface IEdge {
  srcId: string;
  tgtId: string | null;
  propertyId: string;
  label: string | null;
  type: string;
}