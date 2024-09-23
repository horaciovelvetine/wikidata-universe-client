import React, { Dispatch } from 'react';
import { RequestPayload, SketchData } from '../interfaces';
import { CameraManager, Vertex } from './models';
import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react';
import { SketchManager } from "./models/_SketchManager";

interface WikiverseProps {
  originQuery: string; // unused except to refresh component state for fully new queries
  initQueryData: RequestPayload;
  setSketchData: Dispatch<React.SetStateAction<SketchData>>;
  setSelectedVertex: Dispatch<React.SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<React.SetStateAction<Vertex | null>>;
  setCameraRef: Dispatch<React.SetStateAction<CameraManager | undefined>>;
}

// { note } - Y axis is reversed of expectation per P5.js
export const Wikiverse: React.FC<WikiverseProps> = ({ initQueryData, setSketchData, setSelectedVertex, setHoveredVertex, setCameraRef }) => {
  const sketch: Sketch = (p5) => {

    //!/=> Contains operating details of sketch
    const SK = new SketchManager({ p5, initQueryData, setSketchData, setSelectedVertex, setHoveredVertex, setCameraRef })

    //*/=> SETUP...
    p5.preload = () => { SK.preloadFont() }
    p5.setup = () => {
      SK.createCanvas()
      SK.setTextFont()
      SK.initCameraManaged();
      // SK.initPostRelatedDataRequest();
    };

    //*/=> DRAW...
    p5.draw = () => {
      SK.drawUI();
      SK.drawSelectedDetails();
      SK.drawHoveredDetails();
      SK.drawVertices();
      SK.advanceCanimations()
    };

    //*/=> MOUSE PRESS...
    // TODO => Captures ability to check L vs. R is currently unused
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
      // TODO => Refine behavior around click action recording
      SK.handleClickTargetValid(mouseTarget);
      if (SK.clickTargetIsOrigin(mouseTarget)) return; // dont re-fetch
      if (SK.clickTargetInHistory(mouseTarget)) return;

      SK.addClickTargetToHistory(mouseTarget)
      // TODO => jumping off point for additional fetch logic (re: initPostRelated....)

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
    p5.keyPressed = () => { };
  }

  return <ReactP5Wrapper sketch={sketch} />;
};