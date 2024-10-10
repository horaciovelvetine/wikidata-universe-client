import './ActiveQueryLayoutStyle.css'
import React, { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';

import { Wikiverse } from '../p5/Wikiverse';
import { CameraManager, Vertex } from '../p5/models';
import { RequestPayload, RequestResponse, SketchData } from '../interfaces';
import { ActiveQueryControls, HoveredVertexDetails, RelatedEdgesDetails, VerTextDetails } from '../components/ActiveQueryLayout';
import SketchDataDebugSummary from '../components/debug/_SketchDataDebugSummary';

interface ActiveQueryLayoutProps {
  querySessionData: RequestResponse;
  setQuerySessionData: Dispatch<SetStateAction<RequestResponse>>
}

const MemoizedSketch = memo(Wikiverse, (prevProps, nextProps) => {
  return prevProps.initQueryData.query == nextProps.initQueryData.query;
})

export const ActiveQueryLayout: React.FC<ActiveQueryLayoutProps> = ({ querySessionData, setQuerySessionData }) => {
  const initQueryData: RequestPayload = { ...querySessionData.data }
  const [sketchData, setSketchData] = useState<SketchData>(initQueryData);
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraManager>()

  const adjustLookAtHandler = (vert: Vertex) => {
    cameraRef?.setTarget(vert.coords);
  }

  return (
    <>
      <SketchDataDebugSummary {...{ sketchData, cameraRef }} />
      {/* OVERLAY TOP START */}
      <div id='sketch-overlay-top'>
        <HoveredVertexDetails {...{ hoveredVertex }} />
      </div>

      {/* SKETCH START  */}
      {querySessionData.status == 200 ?
        <MemoizedSketch {...{ initQueryData, setSketchData, setSelectedVertex, setHoveredVertex, setCameraRef }} />
        : <></>}

      {/* OVERLAY BOT START */}
      <div id='sketch-overlay-bot'>
        {!!selectedVertex ? <RelatedEdgesDetails {...{ selectedVertex, sketchData, adjustLookAtHandler }} /> : <></>}
        <ActiveQueryControls {...{ initQueryData, setQuerySessionData }} />
        <VerTextDetails {...{ selectedVertex }} />
      </div>
    </>
  );
};
