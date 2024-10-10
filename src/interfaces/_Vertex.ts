import { iPoint3D } from "./_Point3D";

export interface iVertex {
  id: string;
  label: string;
  description: string | null;
  coords: iPoint3D;
  fetched: boolean;
  origin: boolean;
}