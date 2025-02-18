import { useCallback } from "react";
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";

import { P5Sketch } from "../../../types";
import { useWikiverseService } from "../../../providers";
import { SketchProps } from "../sketch-container/sketch-container";

/**
 * Uses the [p5-wrapper/react](https://github.com/P5-wrapper/react) library @see ReactP5Wrapper and @see Sketch to get details.
 * Thank you to them for making this available, and working for those of us who didnt think to look before starting a project with
 * React and P5.js wrapped up in one... ish - unsightly project.
 *
 * This @component is the primary provider for the visuals on screen in the #wikiverse-app-main-display element and contains the underlying
 * logic and methods which provide interactivity and control.
 *
 * @param {skethData} props.sketchData - the primary data used to initialize a sketch
 * @param {SetStateAction} props.setSketchRef - setter to allow react visibility into the active sketch once it is created
 */
export const WikiverseSketch = ({ sketchData, setSketchRef }: SketchProps) => {
  const { makePostRequest } = useWikiverseService();

  const sketch: Sketch = useCallback(
    (p5: P5CanvasInstance) => {
      const SK = new P5Sketch({ p5, sketchData, setSketchRef });

      //*/==> CONFIG!
      p5.preload = () => {
        SK.preloadFont();
      };
      p5.setup = () => {
        SK.createCanvas();
        SK.setTextFont();
        SK.initManagedCamera();
        SK.initCameraPositionAtOriginVertex();
        SK.getInitialRelatedData(makePostRequest);
      };

      //*/==> RESIZE!
      p5.windowResized = () => {
        SK.handleWindowResize();
      };

      //*/==> DRAW!
      p5.draw = () => {
        SK.drawUI(); //
        SK.drawVertices();
        SK.drawSelectedDetails();
        SK.drawHoveredDetails();
        SK.advanceCanimations();
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
        SK.handleClickToFetchTarget(clickTarget, makePostRequest);
      };

      //*/==> KEYPRESS!
      p5.keyPressed = () => {
        switch (p5.key) {
          case "?":
          case "/":
            console.log("SketchData@", SK.graphset);
            break;
          case ",":
          case "<":
            SK.state.toggleShowSketchDetailsSummary();
            break;
          case ".":
          case ">":
            SK.state.toggleClickToFetch();
            break;
          default:
            return;
        }
      };
    },
    [sketchData, makePostRequest]
  );

  return <ReactP5Wrapper sketch={sketch} />;
};
