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
    const S = new SketchManager({ p5, initQueryData, setSketchData, setSelectedVertex, setHoveredVertex, setCameraRef })

    //*/=> SETUP...
    p5.preload = () => { S.preloadFont() }
    p5.setup = () => {
      S.createCanvas()
      S.setTextFont()
      S.initCameraManaged();
      S.initPostRelatedDataRequest();
    };

    //*/=> DRAW...
    p5.draw = () => {
      S.drawUI();
      S.drawSelectedDetails();
      S.drawHoveredDetails();
      S.drawVertices();
      S.advanceCanimations()
    };

    //*/=> MOUSE PRESS...
    // TODO => Captures ability to check L vs. R is currently unused
    p5.mousePressed = () => {
      const mouseTarget = S.mousePositionIsOnAVertex();
      if (mouseTarget == null) return;

      // Deselect...
      if (S.targetAlreadySelected(mouseTarget)) {
        S.selectedVertex = null;
        setSelectedVertex(null);
        return
      }
      // New Selection Made...
      // TODO => Refine behavior around click action recording
      S.handleClickTargetValid(mouseTarget);
      if (S.clickTargetIsOrigin(mouseTarget)) return; // dont re-fetch
      if (S.clickTargetInHistory(mouseTarget)) return;

      S.addClickTargetToHistory(mouseTarget)

      // TODO => jumping off point for additional fetch logic (re: initPostRelated....)
    };

    //*/=> HOVER...
    p5.mouseMoved = () => {
      if (S.stillHoveredLastVertex()) return; // change nothing
      const mouseTarget = S.mousePositionIsOnAVertex(); // Vertex || null;
      if (S.targetAlreadySelected(mouseTarget)) return; // already selected, don't hover

      S.hoveredVertex = mouseTarget;
      setHoveredVertex(mouseTarget)
    };

    //*/=> RESIZE...
    p5.windowResized = () => {
      S.handleResize()
    };

    //*/=> KEYPRESS...
    p5.keyPressed = () => { };
  }

  return <ReactP5Wrapper sketch={sketch} />;
};