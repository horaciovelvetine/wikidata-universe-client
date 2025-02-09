export interface iDimensions {
  width: number;
  height: number;
}

export class Dimensions implements iDimensions {
  width: number = 0;
  height: number = 0;

  constructor();
  constructor(dims?: iDimensions);
  constructor(width: number, height: number);
  constructor(arg1?: number | iDimensions, arg2?: number) {
    if (typeof arg1 === "number") {
      this.width = arg1;
      this.height = arg2 ?? 0;
    } else if (typeof arg1 === "object") {
      this.width = arg1.width;
      this.height = arg1.height;
    }
  }

  /**
   * @method areDefault() - returns true when width & height are 0.
   */
  areDefault() {
    return this.width === 0 && this.height === 0;
  }

  /**
   * @method meetsMinScreenSizeRequirements() - returns true when the measured dimensions are greater than 585(w) X 932(h)
   */
  meetsMinScreenSizeRequirements() {
    return this.width >= 701 && this.height >= 750;
  }
}
