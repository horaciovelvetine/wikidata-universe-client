export interface iProperty {
  id: string;
  label: string | null;
  description: string | null;
  fetched: boolean;
}

export class Property implements iProperty {
  id: string;
  label: string | null;
  description: string | null;
  fetched: boolean;

  constructor(property: iProperty) {
    this.id = property.id;
    this.label = property.label;
    this.description = property.description;
    this.fetched = property.fetched;
  }


  url() {
    return `https://www.wikidata.org/wiki/Property:${this.id}`;
  }
}