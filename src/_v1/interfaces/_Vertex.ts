import { IPoint3D } from ".";

export interface IVertex {
  id: string;
  label: string;
  description: string;
  coords: IPoint3D;
}