import { iProperty } from "../../interfaces";

export class Property implements iProperty {
  id: string;
  label: string;
  description: string;

  constructor(property: iProperty) {
    this.id = property.id;
    this.label = property.label;
    this.description = property.description;
  }
}