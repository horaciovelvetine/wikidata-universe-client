import { P5CanvasInstance } from "@p5-wrapper/react";
import { SketchData } from "../../interfaces";
import { calcVertexSetMean, minMaxValuesInSet, MinMaxSet } from "../functions";

export const UI_BG = (opac: number = 1) => `rgba(1,1,14,${opac})`
export const UI_FONT = (opac: number = 1) => `rgba(255,255,255, ${opac})`

export class UI {
  p5: P5CanvasInstance
  displayBoundingBox: boolean = true;
  bndBoxStrokeWeight: number = 3;
  displayOrientAxis: boolean = false;

  constructor(p5: P5CanvasInstance) {
    this.p5 = p5;
  }

  draw(data: SketchData) {
    this.p5.background(UI_BG())
    this.p5.orbitControl(2, 2, 2); // sensitivity adjustments

    if (!this.displayBoundingBox && !this.displayOrientAxis) return;
    const meanPnt = calcVertexSetMean(data.vertices);
    const minMax = minMaxValuesInSet(data.vertices);
    this.p5.push();
    this.p5.translate(meanPnt.x, meanPnt.y, meanPnt.z)
    this.drawBoundingBox(minMax)
    this.drawOrientAxis(minMax)
    this.p5.pop();
  }

  private drawBoundingBox(minMax: MinMaxSet) {
    if (!this.displayBoundingBox) return;
    this.p5.noFill();
    this.p5.strokeWeight(this.bndBoxStrokeWeight);
    this.p5.stroke(UI_FONT(0.3))
    this.p5.box(minMax.x.diff, minMax.y.diff, minMax.z.diff)
  }

  private drawOrientAxis(minMax: MinMaxSet) {
    if (!this.displayOrientAxis) return;
    const xLen = minMax.x.diff / 2;
    const yLen = minMax.y.diff / 2;
    const zLen = minMax.z.diff / 2;
    this.p5.stroke(255, 0, 0);
    this.p5.line(-xLen, 0, 0, xLen, 0, 0);
    this.p5.stroke(0, 255, 0);
    this.p5.line(0, -yLen, 0, 0, yLen, 0);
    this.p5.stroke(0, 0, 255);
    this.p5.line(0, 0, -zLen, 0, 0, zLen);
    this.p5.noStroke();
  }
}