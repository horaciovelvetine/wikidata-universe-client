import { P5CanvasInstance } from "@p5-wrapper/react";
import { Graphset, iGraphset, MinMaxSet } from "../";

export const UI_BG = (opac: number = 1) => `rgba(1,1,14,${opac})`
export const UI_FONT = (opac: number = 1) => `rgba(255,255,255, ${opac})`

export class UIManager {
  private p5: P5CanvasInstance
  private showMedianAxis: boolean = false;
  private showMedianBoundingBox: boolean = false;

  constructor(p5: P5CanvasInstance) {
    this.p5 = p5;
  }

  /**
   * @method draw() - Main call for all of the UI in the Session. Maitains state for what to display on-screen for a given frame to be able to draw elements of the sketch which are (potentially state dependant) constants.
   */
  draw(data: iGraphset) {
    this.p5.background(UI_BG())
    this.p5.orbitControl(2, 2, 1); // sensitivity adjustments

    const graph = new Graphset(data);

    const meanPnt = graph.calcVertexSetMean(data.vertices);
    const minMax = graph.minMaxValuesInSet(data.vertices);
    this.p5.push();
    this.p5.translate(meanPnt.x, meanPnt.y, meanPnt.z)
    this.drawBoundingBox(minMax)
    this.drawOrientAxis(minMax)
    this.p5.pop();
  }

  /**
   * @method toggleShowMedianAxis() - Used as an external hatch to toggle the current value for showMedianAxis being used when drawing the P5.js sketch itself. 
   */
  toggleShowAxis() {
    this.showMedianAxis = !this.showMedianAxis;
  }

  /**
   * @method toggleShowMedianBoundBox() - Used as an external hatch to toggle the current value for showMedianBoundBox being used when drawing the P5.js sketch itself. 
   */
  toggleShowBoundingBox() {
    this.showMedianBoundingBox = !this.showMedianBoundingBox;
  }

  /**
   * @method getShowMedianAxis() - gets the current value for showMedianAxis held by the UI instance
   */
  getShowAxis() {
    return this.showMedianAxis;
  }

  /**
   * @method getShowMedianBoundingBox() - gets the current value for showMedianBoundingBox held by the UI instance
   */
  getShowBoundingBox() {
    return this.showMedianBoundingBox;
  }

  /**
 * @method drawBoundingBox - Draws a Bounding Box using the MinMax values provided 
 */
  private drawBoundingBox(minMax: MinMaxSet) {
    if (!this.showMedianBoundingBox) return;
    this.p5.noFill();
    this.p5.strokeWeight(5);
    this.p5.stroke(UI_FONT(0.3))
    this.p5.box(minMax.x.diff, minMax.y.diff, minMax.z.diff)
  }

  /**
 * @method drawMedianOrientaxis - Draws the 3 axis positioned at the center 
 */
  private drawOrientAxis(minMax: MinMaxSet) {
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
}