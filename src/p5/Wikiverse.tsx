import React, { Dispatch, SetStateAction } from 'react';
import { RequestPayload, SessionSettingsState, SketchData } from '../interfaces';
import { Vertex } from './models';
import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react';
import { SketchManager } from "./models/_SketchManager";
import { sketchDataCoordsSummary } from '../utils';

interface WikiverseProps {
  initQueryData: RequestPayload;
  setSketchData: Dispatch<SetStateAction<SketchData>>;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  setSketchRef: (sk: SketchManager) => void;
  sessionSettingsState: SessionSettingsState;
}

//! { note } - Y axis is reversed of natural expectation in P5.js
export const Wikiverse: React.FC<WikiverseProps> = ({ initQueryData, setSketchData, setSelectedVertex, setHoveredVertex, setSketchRef, sessionSettingsState }) => {
  const sketch: Sketch = (p5) => {

    //!/=> Contains operating details of sketch
    const SK = new SketchManager({ p5, initQueryData, setSketchData, setSelectedVertex, setHoveredVertex, setSketchRef, sessionSettingsState })

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
      if (p5.key === 'i' || p5.key === 'I') {
        console.log(sketchDataCoordsSummary(SK.data));
      }
      if (p5.key === ',' || p5.key === '<') {
        sessionSettingsState.setShowDebugDetails(prev => { return !prev })
      }

      if (p5.key === '.' || p5.key === '>') {
        sessionSettingsState.setShowUnfetchedVertices(prev => { return !prev })
      }
    };
  }

  return <ReactP5Wrapper sketch={sketch} />;
};