import { P5Sketch } from "./p5-sketch";

/**
 * @remarks
 * Genericize this very common prop setup for components which rely on a {@link P5Sketch} reference to function.
 */
export interface SketchRefProps {
  sketchRef: P5Sketch;
}
