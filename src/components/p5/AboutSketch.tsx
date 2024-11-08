import { FC } from "react"
import { P5CanvasInstance, ReactP5Wrapper } from "@p5-wrapper/react"
import { SketchManager, } from "../../models";
import { MainAppLayoutState } from "../../app/MainAppLayoutState";
import { RequestResponse } from "../../api";

interface AboutSketchProps {
  mainAppLayoutState: MainAppLayoutState;
  initSketchAPIRes: RequestResponse | null;
}

export const AboutSketch: FC<AboutSketchProps> = ({ initSketchAPIRes, mainAppLayoutState }) => {


  const sketch = (p5: P5CanvasInstance) => {
    const SK = new SketchManager({ p5, initSketchAPIRes, mainAppLayoutState, isAboutSketch: true })

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

    //*/==> CLICK R & L
    p5.mousePressed = () => {
      const mouseTarget = SK.mousePositionIsOnAVertex();
      if (mouseTarget == null) return;

      // Deselect...
      if (SK.targetIsAlreadyCurSelected(mouseTarget)) {
        SK.updateSelectedVertex(null); // none selected is null
        return
      } else {
        // New Selection Made...
        SK.handleClickTargetValid(mouseTarget);
        if (SK.aboutSketchHasClickToFetchEnabled()) { // enables feature past slide10
          SK.fetchClickTargetData(mouseTarget);
        }
        SK.getNextAboutTarget(mouseTarget);
      }
    };

    //*/=> HOVER
    p5.mouseMoved = () => {
      if (SK.stillHoveredLastVertex()) return; // change nothing
      const mouseTarget = SK.mousePositionIsOnAVertex(); // Vertex || null;
      if (SK.targetIsAlreadyCurSelected(mouseTarget)) return; // already selected, don't hover

      SK.updateHoveredVertex(mouseTarget);
    };

    //*/==> KEY PRESS
    p5.keyPressed = () => {
      switch (p5.key) {
        case '?':
          console.log('SketchData@', SK.GRAPH());
          break;
        case ',':
        case '<':
          mainAppLayoutState.setShowDebugDetails(prev => !prev);
          break;
        case ' ':
          SK.getNextAboutTargetKeyAdvance();
          break;
        default:
          break;
      }
    };
  }

  return < ReactP5Wrapper sketch={sketch} />
}