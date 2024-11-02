import { Dispatch, FC, SetStateAction } from "react"
import { P5CanvasInstance, ReactP5Wrapper } from "@p5-wrapper/react"
import { SketchManager, Vertex } from "../../models";
import { MainAppLayoutState } from "../../app/MainAppLayoutState";
import { RequestResponse } from "../../api";

interface AboutSketchProps {
  mainAppLayoutState: MainAppLayoutState;
  initSketchAPIRes: RequestResponse | null;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  setP5SketchRef: Dispatch<SetStateAction<SketchManager | null>>;
}

export const AboutSketch: FC<AboutSketchProps> = ({ initSketchAPIRes, mainAppLayoutState, setSelectedVertex, setHoveredVertex, setP5SketchRef }) => {
  const sketch = (p5: P5CanvasInstance) => {
    const SK = new SketchManager({ p5, initSketchAPIRes, mainAppLayoutState, setSelectedVertex, setHoveredVertex, setSketchRef: setP5SketchRef, isAboutSketch: true })

    //*/==> SETUP
    p5.preload = () => { SK.preloadFont() };
    p5.setup = () => {
      SK.createCanvas();
      SK.setTextFont();
      SK.initManagedCamera();
      SK.initCameraPositionAtAboutStart();
    };

    //*/==> DRAW
    p5.draw = () => {
      SK.drawUI();
      SK.drawVertices();
      SK.drawSelectedDetails();
      SK.drawHoveredDetails();
      SK.advanceCanimations();
    };

    //*/==> RESIZE
    p5.windowResized = () => {
      SK.handleResize();
    }

    p5.mousePressed = () => {
      const mouseTarget = SK.mousePositionIsOnAVertex();
      if (mouseTarget == null) return;

      // Deselect...
      if (SK.targetIsAlreadyCurSelected(mouseTarget)) {
        SK.updateSelectedVertex(null); // none selected is null
        return
      }
      // New Selection Made...
      SK.handleClickTargetValid(mouseTarget);
    };

    p5.keyPressed = () => {
      switch (p5.key) {
        case '?':
          console.log('SketchData@', SK.GRAPH());
          break;
        case ',':
        case '<':
          mainAppLayoutState.setShowDebugDetails(prev => !prev);
          break;
        default:
          break;
      }
    };
  }

  return < ReactP5Wrapper sketch={sketch} />
}