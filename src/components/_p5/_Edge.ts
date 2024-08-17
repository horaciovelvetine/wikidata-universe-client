import { P5CanvasInstance } from "@p5-wrapper/react";

export class Edge {
  srcId: string;
  tgtId: string;
  label: string;

  constructor(srcId: string, tgtId: string, label: string) {
    this.srcId = srcId;
    this.tgtId = tgtId;
    this.label = label;
  }

  draw(p5: P5CanvasInstance) { }
}