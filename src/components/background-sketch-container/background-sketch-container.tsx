import "./background-sketch-container.css";
import { createRef, useEffect } from "react";
import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";

import { Particle } from "../../types";
import { WikiverseServiceResponse } from "../../contexts";
import { getMainDispDimensions } from "../../utils/get-main-disp-dimensions";

interface BackgroundSketchContainerProps {
  initSketchData: WikiverseServiceResponse | null;
}

export const BackgroundSketchContainer = ({
  initSketchData,
}: BackgroundSketchContainerProps) => {
  const containerRef = createRef<HTMLDivElement>();
  const particles: Particle[] = [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (initSketchData) {
      container.style.opacity = "0";
      setTimeout(() => {
        container.style.display = "none";
      }, 235);
    } else {
      container.style.display = "block";
      setTimeout(() => {
        container.style.opacity = "100";
      }, 1);
    }
  }, [initSketchData, containerRef]);

  const sketch: Sketch = p5 => {
    p5.setup = () => {
      const dimensions = getMainDispDimensions();

      const totalParticles = dimensions.width / 10;
      p5.createCanvas(dimensions.width, dimensions.height);
      for (let n = 0; n < totalParticles; n++) {
        const particle = new Particle(p5, dimensions);
        particles.push(particle);
      }
    };

    p5.draw = () => {
      p5.background("#01010e");
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].move();
        particles[i].joinNearby(particles.slice(i));
      }
    };

    p5.windowResized = () => {
      const dimensions = getMainDispDimensions();
      p5.resizeCanvas(dimensions.width, dimensions.height);
    };
  };

  return (
    <div id="background-sketch-container" ref={containerRef}>
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
};
