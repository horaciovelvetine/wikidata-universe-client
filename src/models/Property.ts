export interface iProperty {
  id: string;
  label: string | null;
  description: string | null;
}

export class Property implements iProperty {
  id: string;
  label: string | null;
  description: string | null;

  constructor(property: iProperty) {
    this.id = property.id;
    this.label = property.label;
    this.description = property.description;
  }
}