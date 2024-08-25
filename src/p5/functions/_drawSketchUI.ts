import { P5CanvasInstance } from "@p5-wrapper/react";
import { SketchData } from "../../interfaces";
import { calcVertexSetMean, minMaxValuesInSet } from "../functions";

export function drawSketchUI(p5: P5CanvasInstance, session: SketchData) {
  p5.background('rgb(1, 1, 14)');
  p5.orbitControl(2, 2, 2);
  p5.rectMode(p5.CENTER);
  // move near plane closer to camer, otherwise default
  const aspectRatio = p5.width / p5.height;
  const defaultFoc = (2 * p5.atan(p5.height / 2 / 800));
  p5.perspective(defaultFoc, aspectRatio, 1, 80000);

  const meanPoint = calcVertexSetMean(session.vertices);
  const minMax = minMaxValuesInSet(session.vertices);
  const xDiff = minMax.x.max - minMax.x.min;
  const yDiff = minMax.y.max - minMax.y.min;
  const zDiff = minMax.z.max - minMax.z.min;
  const xLen = xDiff / 2;
  const yLen = yDiff / 2;
  const zLen = zDiff / 2;

  p5.push();
  p5.translate(meanPoint.x, meanPoint.y, meanPoint.z);
  p5.strokeWeight(5);
  p5.noFill();
  p5.stroke('rgba(255, 255, 255, 0.5)');
  p5.box(xDiff, yDiff, zDiff);
  p5.stroke(255, 0, 0);
  p5.line(-xLen, 0, 0, xLen, 0, 0);
  p5.stroke(0, 255, 0);
  p5.line(0, -yLen, 0, 0, yLen, 0);
  p5.stroke(0, 0, 255);
  p5.line(0, 0, -zLen, 0, 0, zLen);
  p5.pop();

}