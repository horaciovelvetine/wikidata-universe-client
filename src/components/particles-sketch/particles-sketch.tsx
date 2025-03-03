import "./particles-sketch.css";
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";

import { Particle, WikiverseServiceResponse } from "../../types";
import { getMainDispDimensions } from "../../utils/get-main-disp-dimensions";
import { useCallback } from "react";

interface ParticlesSketchProps {
  sketchData: WikiverseServiceResponse | null;
}
/**
 * A P5 Sketch which creates an idle animation to fill the #wikiverse-app-main-display while
 * no WikiverseSketch is currently active. The Sketch draws a number of particles on screen, moves them
 * around the screen, and joined with nearby particles on every frame. The canvas resizes with the window
 * and fades the canvas when @var initSketchData - is provided and the user initializes a WikiverseSketch.
 *
 * @component
 * @param {WikiverseServiceResponse | null} props.initSketchData - Initial data for the sketch, if available.
 */

export const ParticlesSketch = ({ sketchData }: ParticlesSketchProps) => {
  const particles: Particle[] = [];

  const sketch: Sketch = useCallback(
    (p5: P5CanvasInstance) => {
      // called once at the beginning
      p5.setup = () => {
        const { width, height } = getMainDispDimensions();
        p5.createCanvas(width, height);

        const totalParticles = width / 10;
        for (let n = 0; n < totalParticles; n++) {
          const particle = new Particle(p5, { width, height });
          particles.push(particle);
        }
      };

      // called once per frame
      p5.draw = () => {
        p5.background("#01010e");
        for (let i = 0; i < particles.length; i++) {
          particles[i].draw();
          particles[i].move();
          particles[i].joinNearby(particles.slice(i));
        }
      };

      p5.windowResized = () => {
        const { width, height } = getMainDispDimensions();
        p5.resizeCanvas(width, height);
      };
    },
    [particles]
  );

  return (
    <div
      id="background-sketch-container"
      className={sketchData ? "" : "on-screen"}
    >
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
};
