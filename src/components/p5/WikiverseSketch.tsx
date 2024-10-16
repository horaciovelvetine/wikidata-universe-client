import React, { Dispatch, FC, SetStateAction } from 'react';
import { RequestPayload, RequestResponse, SessionSettingsState, SketchData } from '../../interfaces';
import { Vertex, SketchManager } from '../../models';
import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react';

interface WikiverseProps {
  initialQueryResponse: RequestResponse | null; // only used to determine re-renders
  setWikiverseSketchData: Dispatch<SetStateAction<SketchData | null>>;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  setP5SketchRef: Dispatch<SetStateAction<SketchManager | null>>; // to ref sketch details
  sessionSettingsState: SessionSettingsState;
}

//! { note } - Y axis is reversed of natural expectation in P5.js
export const WikiverseSketch: FC<WikiverseProps> = ({ initialQueryResponse, setWikiverseSketchData, setSelectedVertex, setHoveredVertex, setP5SketchRef, sessionSettingsState }) => {

  const sketch: Sketch = (p5) => { //SketchManager contains a lionshare of the p5 sketch specific details
    const SK = new SketchManager({ p5, initialQueryResponse, setWikiverseSketchData, setSelectedVertex, setHoveredVertex, setP5SketchRef, sessionSettingsState })

    //*/=> SETUP...
    p5.preload = () => { SK.preloadFont() }
    p5.setup = async () => {
      SK.createCanvas()
      SK.setTextFont()
      SK.initCameraManaged();
      SK.initPostRelatedDataRequest();
    };

    //*/=> DRAW...
    p5.draw = () => {
      SK.drawUI();
      SK.drawVertices();
      SK.drawSelectedDetails();
      SK.drawHoveredDetails();
      SK.advanceCanimations()
    };

    //*/=> MOUSE PRESS...
    p5.mousePressed = () => {
      const mouseTarget = SK.mousePositionIsOnAVertex();
      if (mouseTarget == null) return;

      // Deselect...
      if (SK.targetAlreadySelected(mouseTarget)) {
        SK.selectedVertex = null;
        setSelectedVertex(null);
        return
      }
      // New Selection Made...
      SK.handleClickTargetValid(mouseTarget);
      if (SK.clickTargetIsOrigin(mouseTarget)) return;
    };

    //*/=> HOVER...
    p5.mouseMoved = () => {
      if (SK.stillHoveredLastVertex()) return; // change nothing
      const mouseTarget = SK.mousePositionIsOnAVertex(); // Vertex || null;
      if (SK.targetAlreadySelected(mouseTarget)) return; // already selected, don't hover

      SK.hoveredVertex = mouseTarget;
      setHoveredVertex(mouseTarget)
    };

    //*/=> RESIZE...
    p5.windowResized = () => {
      SK.handleResize()
    };

    //*/=> KEYPRESS...
    p5.keyPressed = () => {
      switch (p5.key) {
        case '?':
          console.log(SK.sketchDataCoordsSummary());
          break;
        case ',':
        case '<':
          sessionSettingsState.setShowDebugDetails(prev => !prev);
          break;
        case '.':
        case '>':
          sessionSettingsState.setShowUnfetchedVertices(prev => !prev);
          break;
        default:
          break;
      }
    };
  }

  return <ReactP5Wrapper sketch={sketch} />;
};