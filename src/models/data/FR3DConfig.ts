export interface iFR3DConfig {
  dataDensity: number;
  repMult: number;
  attrMult: number;
}

export class FR3DConfig {
  dataDensity: number;
  repMult: number;
  attrMult: number;

  constructor(dataDensity: number, repMult: number, attrMult: number) {
    this.dataDensity = dataDensity;
    this.repMult = repMult;
    this.attrMult = attrMult;
  }
}