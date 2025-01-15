export interface iProperty {
  id: string;
  label: string
  description: string
  fetched: boolean
}

export class Property implements iProperty {
  id: string;
  label: string;
  description: string;
  fetched: boolean = false;
  readonly WIKIDATA_URL: string = 'https://www.wikidata.org/wiki/Property:';

  constructor(property: iProperty);
  constructor(id: string, label: string, description: string);
  constructor(idOrProperty: string | iProperty, label?: string, description?: string) {
    if (typeof idOrProperty === 'string') {
      this.id = idOrProperty;
      this.label = label!;
      this.description = description!;
    } else {
      this.id = idOrProperty.id;
      this.label = idOrProperty.label;
      this.description = idOrProperty.description;
      this.fetched = idOrProperty.fetched;
    }
  }

  /**
   * @method mergeResponseData() - update the attributes with the provided response iProperty
   */
  mergeResponseData(prop: iProperty) {
    this.label = prop.label
    this.description = prop.description;
    this.fetched = true;
  }

  /**
   * @method url() - the URL text linking to the original entry in Wikidata. 
   */
  url() {
    return this.WIKIDATA_URL + this.id;
  }
}