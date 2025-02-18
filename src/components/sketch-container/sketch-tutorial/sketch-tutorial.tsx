import { useCallback } from "react";
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";

import { TutorialSketch } from "../../../types";
import { useWikiverseService } from "../../../providers";
import { SketchProps } from "../sketch-container/sketch-container";

/**
 * Primary wrapper for the @see TutorialSketch (class) whose behavior differs slightly from the primary sketch @see P5Sketch.
 * Uses the [p5-wrapper/react](https://github.com/P5-wrapper/react) library @see ReactP5Wrapper and @see Sketch to get details.
 * Thank you to them for making this available, and working for those of us who didnt think to look before starting a project with
 * React and P5.js wrapped up in one... ish - unsightly project.
 *
 * This @component is the primary provider for the visuals on screen in the #wikiverse-app-main-display element and contains the underlying
 * logic and methods which provide interactivity and control. @apiNote the @see TutorialSketch (class) behavior differs slightly from the primary
 * @see P5Sketch by progressively introducing and enabling features for the user as they learn and explore.
 *
 * @param {skethData} props.sketchData - the primary data used to initialize a sketch
 * @param {SetStateAction} props.setSketchRef - setter to allow react visibility into the active sketch once it is created
 */
export const SketchTutorial = ({ sketchData, setSketchRef }: SketchProps) => {
  const { getTutorialStep } = useWikiverseService();

  const sketch: Sketch = useCallback(
    (p5: P5CanvasInstance) => {
      const SK = new TutorialSketch({ p5, sketchData, setSketchRef });

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

        //TODO refine behavior
        SK.handleNewSelectionClickTarget(clickTarget);
        // SK.handleClickToFetchTarget(clickTarget, post);
      };

      //*/==> KEYPRESS!
      p5.keyPressed = () => {};
    },
    [sketchData, getTutorialStep]
  );

  return <ReactP5Wrapper sketch={sketch} />;
};
