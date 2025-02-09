import { P5Sketch, SketchProps } from "./p5-sketch";

export class TutorialSketch extends P5Sketch {
  private curSlide = 1;

  constructor(props: SketchProps) {
    super(props);
    this.state.updateTutorialState(props.initSketchData);
  }

  /**
   * @method getNextSlideNumber() - increments the curSlide number and returns the new incremented value.
   */
  getNextSlideNumber(): number {
    this.curSlide += 1;
    return this.curSlide;
  }

  /**
   * @method getPrevSlideNumber() - decrements the curSlide number and returns the new decremented value. (Prevents decrementing past 1)
   */
  getPrevSlideNumber(): number {
    if (this.curSlide > 1) {
      this.curSlide -= 1;
    }
    return this.curSlide;
  }
}
