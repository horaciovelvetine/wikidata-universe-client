import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";

import { SketchContainerProps } from "../";
import { P5Sketch } from "../../../../types";
import { useWikiverseService } from "../../../../contexts";


export const WikiverseSketch = ({ initSketchData, setSketchRef }: SketchContainerProps) => {
  const { post } = useWikiverseService();

  const sketch: Sketch = p5 => {
    const SK = new P5Sketch({ p5, initSketchData, setSketchRef })

    //*/==> CONFIG!
    p5.preload = () => { SK.preloadFont() };
    p5.setup = () => {
      SK.createCanvas();
      SK.setTextFont();
      SK.initManagedCamera();
      SK.initCameraPositionAtOriginVertex();
      SK.getInitialRelatedData(post);
    }

    //*/==> RESIZE!
    p5.windowResized = () => {
      SK.handleWindowResize()
    };

    //*/==> DRAW!
    p5.draw = () => {
      SK.drawUI(); //
      SK.drawVertices();
      SK.drawSelectedDetails();
      SK.drawHoveredDetails();
      SK.advanceCanimations()
    };

    //*/==> HOVER!
    p5.mouseMoved = () => {
      const curMouseTarget = SK.mousePositionedOnVertex();
      const hovIsCurSelected = SK.curTgtVertMatchesCurSelectedVertex(curMouseTarget);

      if (!curMouseTarget || hovIsCurSelected) {
        SK.state.setCurHovered(null);
      } else {
        SK.state.setCurHovered(curMouseTarget);
      }
    }

    //*/==> CLICKED (LEFT ONLY!!)
    p5.mouseClicked = () => {
      const clickTarget = SK.mousePositionedOnVertex();
      if (!clickTarget) return;

      if (SK.curTgtVertMatchesCurSelectedVertex(clickTarget)) { // Deselect curSelected...
        SK.state.setCurSelected(null);
        return;
      }

      SK.handleNewSelectionClickTarget(clickTarget);
      SK.handleClickToFetchTarget(clickTarget, post);
    }

    //*/==> KEYPRESS!
    p5.keyPressed = () => {
      switch (p5.key) {
        case '?':
        case '/':
          console.log('SketchData@', SK.graphset);
          break;
        case ',':
        case '<':
          SK.state.toggleShowSketchDetailsSummary();
          break;
        case '.':
        case '>':
          SK.state.toggleClickToFetch();
          break;
        default:
          return;
      }
    }

  }

  return (<ReactP5Wrapper sketch={sketch} />)
}