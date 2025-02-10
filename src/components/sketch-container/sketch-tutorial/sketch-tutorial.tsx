import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";

import { TutorialSketch } from "../../../types";
import { useWikiverseService } from "../../../contexts";
import { SketchContainerProps } from "../sketch-container/sketch-container";

export const SketchTutorial = ({
  initSketchData,
  setSketchRef,
}: SketchContainerProps) => {
  const { getTutorial } = useWikiverseService();

  const sketch: Sketch = p5 => {
    const SK = new TutorialSketch({ p5, initSketchData, setSketchRef });

    //*/==> CONFIG!
    p5.preload = () => {
      SK.preloadFont();
    };
    p5.setup = () => {
      SK.createCanvas();
      SK.setTextFont();
      SK.initManagedCamera();
      SK.initCameraPositionAtOriginVertex();
    };

    //*/==> DRAW!
    p5.draw = () => {
      SK.drawUI();
      SK.drawVertices();
      SK.drawSelectedDetails();
      SK.drawHoveredDetails();
      SK.advanceCanimations();
    };

    //*/==> RESIZE!
    p5.windowResized = () => {
      SK.handleWindowResize();
    };

    //*/==> HOVER!
    p5.mouseMoved = () => {
      const curMouseTarget = SK.mousePositionedOnVertex();
      const hovIsCurSelected =
        SK.curTgtVertMatchesCurSelectedVertex(curMouseTarget);

      if (!curMouseTarget || hovIsCurSelected) {
        SK.state.setCurHovered(null);
      } else {
        SK.state.setCurHovered(curMouseTarget);
      }
    };

    //*/==> CLICKED (LEFT ONLY!!)
    p5.mouseClicked = () => {
      const clickTarget = SK.mousePositionedOnVertex();
      if (!clickTarget) return;

      if (SK.curTgtVertMatchesCurSelectedVertex(clickTarget)) {
        // Deselect curSelected...
        SK.state.setCurSelected(null);
        return;
      }

      SK.handleNewSelectionClickTarget(clickTarget);
      // SK.handleClickToFetchTarget(clickTarget, post);
    };

    //*/==> KEYPRESS!
    p5.keyPressed = () => {};
  };

  return <ReactP5Wrapper sketch={sketch} />;
};
