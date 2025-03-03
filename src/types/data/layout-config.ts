export interface LayoutConfig {
  dataDensity: number;
  attractionMult: number;
  repulsionMult: number;
}

export class LayoutConfigImpl implements LayoutConfig {
  dataDensity: number;
  attractionMult: number;
  repulsionMult: number;

  constructor();
  constructor(defaultConfig?: LayoutConfig) {
    if (defaultConfig) {
      this.dataDensity = defaultConfig.dataDensity;
      this.attractionMult = defaultConfig.attractionMult;
      this.repulsionMult = defaultConfig.repulsionMult;
    } else {
      this.dataDensity = 0.0001;
      this.repulsionMult = 0.55;
      this.attractionMult = 1.25;
    }
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

  updateConfigValues(dens: number, attr: number, rep: number): LayoutConfig {
    this.dataDensity = dens;
    this.attractionMult = attr;
    this.repulsionMult = rep;
    return this;
  }
}
