import './ActiveQueryLayoutStyle.css'
import React, { Dispatch, memo, SetStateAction, useState } from 'react';

import { Wikiverse } from '../p5/Wikiverse';
import { Vertex } from '../p5/models';
import { RequestPayload, RequestResponse, SessionSettingsState, SketchData } from '../interfaces';
import { ActiveQueryControls, HoveredVertexDetails, RelatedEdgesDetails, VerTextDetails, SketchDataDebugSummary } from '../components';
import { SketchManager } from '../p5/models/_SketchManager';

interface ActiveQueryLayoutProps {
  querySessionData: RequestResponse;
  setQuerySessionData: Dispatch<SetStateAction<RequestResponse>>;
  sessionSettingsState: SessionSettingsState;
  setMALSketchRef: Dispatch<SetStateAction<SketchManager | undefined>>;
}

const MemoizedSketch = memo(Wikiverse, (prevProps, nextProps) => {
  return prevProps.initQueryData.query == nextProps.initQueryData.query;
})

export const ActiveQueryLayout: React.FC<ActiveQueryLayoutProps> = ({ querySessionData, setQuerySessionData, sessionSettingsState, setMALSketchRef }) => {
  const initQueryData: RequestPayload = { ...querySessionData.data }
  const { showDebugDetails } = sessionSettingsState; //sets correct ref for React + P5.js mngmnt

  const [sketchData, setSketchData] = useState<SketchData>(initQueryData);
  const [aqlSketchRef, setAQLSketchRef] = useState<SketchManager>();

  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);

  const adjustLookAtHandler = (vert: Vertex) => {
    aqlSketchRef?.CAM().setTarget(vert.coords);
  }

  const bubbleUpSetSketchRefHandler = (sktchManagerRef: SketchManager) => {
    setAQLSketchRef(sktchManagerRef);
    setMALSketchRef(sktchManagerRef);
  };

  return (
    <>
      {/* DEBUG DETAILS  */}
      {showDebugDetails ? <SketchDataDebugSummary {...{ sketchData, aqlSketchRef }} /> : <></>}

      {/* OVERLAY TOP START */}
      <div id='sketch-overlay-top'>
        <HoveredVertexDetails {...{ hoveredVertex }} />
      </div>

      {/* SKETCH START  */}
      <MemoizedSketch {...{ initQueryData, setSketchData, setSelectedVertex, setHoveredVertex, setSketchRef: bubbleUpSetSketchRefHandler, sessionSettingsState }} />


      {/* OVERLAY BOT START */}
      <div id='sketch-overlay-bot'>
        <RelatedEdgesDetails {...{ selectedVertex, sketchData, adjustLookAtHandler }} />
        <ActiveQueryControls {...{ initQueryData, setQuerySessionData }} />
        <VerTextDetails {...{ selectedVertex }} />
      </div>
    </>
  );
};
