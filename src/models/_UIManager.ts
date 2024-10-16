import { P5CanvasInstance } from "@p5-wrapper/react";
import { SessionSettingsState, SketchData } from "../../interfaces";
import { calcVertexSetMean, minMaxValuesInSet, MinMaxSet } from "../functions";

export const UI_BG = (opac: number = 1) => `rgba(1,1,14,${opac})`
export const UI_FONT = (opac: number = 1) => `rgba(255,255,255, ${opac})`

export class UIManager {
  p5: P5CanvasInstance
  showMedianAxis: boolean;
  showMedianBoundBox: boolean;
  showDimensionBoundBox: boolean;

  constructor(p5: P5CanvasInstance, sessionSettings: SessionSettingsState) {
    this.p5 = p5;
    this.showMedianAxis = sessionSettings.showMedianAxis;
    this.showMedianBoundBox = sessionSettings.showMedianBoundBox;
    this.showDimensionBoundBox = sessionSettings.showDimensionBoundBox;
  }

  /**
   * @method draw() - Main call for all of the UI in the Session. Maitains state for what to display on-screen for a given frame to be able to draw elements of the sketch which are (potentially state dependant) constants.
   */
  draw(data: SketchData) {
    this.p5.background(UI_BG())
    this.p5.orbitControl(2, 2, 2); // sensitivity adjustments

    const meanPnt = calcVertexSetMean(data.vertices);
    const minMax = minMaxValuesInSet(data.vertices);
    this.p5.push();
    this.drawDimensionBoundingBox(); //! must call before translate...
    this.p5.translate(meanPnt.x, meanPnt.y, meanPnt.z)
    this.drawMedianBoundingBox(minMax)
    this.drawMedianOrientAxis(minMax)
    this.p5.pop();
  }

  /**
   * @method toggleShowMedianAxis() - Used as an external hatch to toggle the current value for showMedianAxis being used when drawing the P5.js sketch itself. 
   */
  toggleShowMedianAxis() {
    this.showMedianAxis = !this.showMedianAxis;
  }


  /**
   * @method toggleShowMedianBoundBox() - Used as an external hatch to toggle the current value for showMedianBoundBox being used when drawing the P5.js sketch itself. 
   */
  toggleShowMedianBoundBox() {
    this.showMedianBoundBox = !this.showMedianBoundBox;
  }


  /**
   * @method toggleShowDimensionBoundBox() - Used as an external hatch to toggle the current value for showDimensionBoundBox being used when drawing the P5.js sketch itself. 
   */
  toggleShowDimensionBoundBox() {
    this.showDimensionBoundBox = !this.showDimensionBoundBox;
  }

  /**
 * @method drawBoundingBox - Draws a Bounding Box using the MinMax values provided 
 */
  private drawMedianBoundingBox(minMax: MinMaxSet) {
    if (!this.showMedianBoundBox) return;
    this.p5.noFill();
    this.p5.strokeWeight(1);
    this.p5.stroke(UI_FONT(0.3))
    this.p5.box(minMax.x.diff, minMax.y.diff, minMax.z.diff)
  }

  /**
 * @method drawMedianOrientaxis - Draws the 3 axis positioned at the center 
 */
  private drawMedianOrientAxis(minMax: MinMaxSet) {
    if (!this.showMedianAxis) return;
    const xLen = minMax.x.diff / 2;
    const yLen = minMax.y.diff / 2;
    const zLen = minMax.z.diff / 2;
    this.p5.strokeWeight(1);
    this.p5.stroke(255, 0, 0);
    this.p5.line(-xLen, 0, 0, xLen, 0, 0);
    this.p5.stroke(0, 255, 0);
    this.p5.line(0, -yLen, 0, 0, yLen, 0);
    this.p5.stroke(0, 0, 255);
    this.p5.line(0, 0, -zLen, 0, 0, zLen);
    this.p5.noStroke();
  }

  /**
   * @method drawDimensionBoundingBox - Draws a Bounding Box using the dimensions of the p5 canvas
   */
  private drawDimensionBoundingBox() {
    if (!this.showDimensionBoundBox) return;
    const { width, height } = this.p5;
    this.p5.noFill();
    this.p5.strokeWeight(1);
    this.p5.stroke(UI_FONT(0.3));
    this.p5.box(width, height, Math.min(width, height));
  }
}