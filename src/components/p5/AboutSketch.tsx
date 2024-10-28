import { Dispatch, FC, SetStateAction } from "react"
import { P5CanvasInstance, ReactP5Wrapper } from "@p5-wrapper/react"
import { SketchManager, Vertex } from "../../models";
import { MainAppLayoutState } from "../../app/MainAppLayoutState";

interface AboutSketchProps {
  mainAppLayoutState: MainAppLayoutState;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  setP5SketchRef: Dispatch<SetStateAction<SketchManager | null>>;
}

export const AboutSketch: FC<AboutSketchProps> = ({ mainAppLayoutState, setSelectedVertex, setHoveredVertex, setP5SketchRef }) => {
  const sketch = (p5: P5CanvasInstance) => {
    const SK = new SketchManager({ p5, initSketchAPIRes: null, mainAppLayoutState, setSelectedVertex, setHoveredVertex, setSketchRef: setP5SketchRef })

    //*/==> SETUP
    p5.preload = () => { SK.preloadFont() };
    p5.setup = () => {
      SK.createCanvas();
      SK.setTextFont();
      SK.initManagedCamera();
    };

    //*/==> DRAW
    p5.draw = () => {
      p5.background(200);
      p5.sphere(50);
    };

    //*/==> RESIZE
    p5.windowResized = () => {
      SK.handleResize();
    }
  }

  return < ReactP5Wrapper sketch={sketch} />
}