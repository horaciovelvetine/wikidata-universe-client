import './QueryLayoutStyle.css'

import React, { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { RequestPayload, RequestResponse, SketchData } from '../interfaces';
import { CameraManager, Vertex } from '../p5/models';
import { Wikiverse } from '../p5/Wikiverse';
import { ActiveQueryControls, HoveredVertexDetails, RelatedEdgesDetails, VerTextDetails } from '../components';

interface Props {
  initQueryRes: RequestResponse;
  setInitQueryRes: Dispatch<SetStateAction<RequestResponse>>
}

const MemoizedSketch = memo(Wikiverse, (prevProps, nextProps) => {
  return prevProps.originQuery == nextProps.originQuery;
})

export const QueryLayout: React.FC<Props> = ({ initQueryRes, setInitQueryRes }) => {
  const initQueryData: RequestPayload = { ...initQueryRes.data }
  const [originQuery, setOriginQuery] = useState<string>(initQueryRes.data.query) // validates p5.sketch re-render
  const [sketchData, setSketchData] = useState<SketchData>(initQueryData);
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null); // init res has only origin data
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraManager>()

  useEffect(() => {
    setOriginQuery(initQueryRes.data.query)
    setSketchData(initQueryData)
  }, [initQueryRes])

  const adjustLookAtHandler = (vert: Vertex) => {
    cameraRef?.setTarget(vert.coords);
  }

  return (
    <>

      {/* OVERLAY TOP START */}
      <div id='sketch-overlay-top'>
        <HoveredVertexDetails {...{ hoveredVertex }} />
      </div>

      {/* SKETCH START  */}
      {initQueryRes.status == 200 ?
        <MemoizedSketch {...{ originQuery, initQueryData, setSketchData, setSelectedVertex, setHoveredVertex, setCameraRef }} />
        : <></>}

      {/* OVERLAY BOT START */}
      <div id='sketch-overlay-bot'>
        {!!selectedVertex ? <RelatedEdgesDetails {...{ selectedVertex, sketchData, adjustLookAtHandler }} /> : <></>}
        <ActiveQueryControls {...{ originQuery, setInitQueryRes }} />
        <VerTextDetails {...{ selectedVertex }} />
      </div>

    </>
  );
};
