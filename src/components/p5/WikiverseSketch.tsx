import { Dispatch, FC, SetStateAction } from 'react';
import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react';

import { SketchManager, Vertex } from '../../models';
import { RequestResponse } from '../../api';
import { MainAppLayoutState } from '../../app/MainAppLayoutState';


interface WikiverseProps {
  mainAppLayoutState: MainAppLayoutState;
  initSketchAPIRes: RequestResponse | null;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  setP5SketchRef: Dispatch<SetStateAction<SketchManager | null>>;
}

//! { note } - Y axis is reversed of natural expectation in P5.js
export const WikiverseSketch: FC<WikiverseProps> = ({ mainAppLayoutState, initSketchAPIRes, setSelectedVertex, setHoveredVertex, setP5SketchRef }) => {

  const sketch: Sketch = (p5) => { //SketchManager contains a lionshare of the p5 sketch specific details
    const SK = new SketchManager({ p5, initSketchAPIRes, mainAppLayoutState, setSelectedVertex, setHoveredVertex, setSketchRef: setP5SketchRef })

    //*/=> SETUP
    p5.preload = () => { SK.preloadFont() }
    p5.setup = async () => {
      SK.createCanvas()
      SK.setTextFont()
      SK.initManagedCamera();
      SK.initCameraPositionAtOriginVertex();
      SK.initPostRelatedDataRequest();
    };

    //*/=> DRAW
    p5.draw = () => {
      SK.drawUI();
      SK.drawVertices();
      SK.drawSelectedDetails();
      SK.drawHoveredDetails();
      SK.advanceCanimations()
    };

    //*/=> MOUSE PRESS (BOTH L & R)
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
      SK.fetchClickTargetData(mouseTarget);

    };

    //*/=> HOVER
    p5.mouseMoved = () => {
      if (SK.stillHoveredLastVertex()) return; // change nothing
      const mouseTarget = SK.mousePositionIsOnAVertex(); // Vertex || null;
      if (SK.targetIsAlreadyCurSelected(mouseTarget)) return; // already selected, don't hover

      SK.updateHoveredVertex(mouseTarget);
    };

    //*/=> RESIZE
    p5.windowResized = () => {
      SK.handleResize()
    };

    //*/=> KEYPRESS
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

  return <ReactP5Wrapper sketch={sketch} />;
};