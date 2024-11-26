export interface iLayoutConfig {
  dataDensity: number;
  attractionMult: number;
  repulsionMult: number;
}

export class LayoutConfig implements iLayoutConfig {
  dataDensity: number;
  attractionMult: number;
  repulsionMult: number;

  constructor(defaultConfig: iLayoutConfig) {
    this.dataDensity = defaultConfig.dataDensity;
    this.attractionMult = defaultConfig.attractionMult;
    this.repulsionMult = defaultConfig.repulsionMult;
  }

  updateDataDensity(dens: number) {
    this.dataDensity = dens;
  }

  updateAttractionMult(attr: number) {
    this.attractionMult = attr;
  }

  updateRepulsionMult(rep: number) {
    this.repulsionMult = rep;
  }

  updateConfigValues(dens: number, attr: number, rep: number) {
    this.dataDensity = dens;
    this.attractionMult = attr;
    this.repulsionMult = rep;
  }
}