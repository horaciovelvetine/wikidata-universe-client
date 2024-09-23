export interface iEdge {
  srcId: string;
  tgtId: string | null;
  propertyId: string;
  label: string | null;
  type: string;
}
