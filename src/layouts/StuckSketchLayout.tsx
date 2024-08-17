import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ISessionData, LayoutsProps } from '../interfaces';
import { QuerySketch, StandbySketch, Footer, ActiveQueryControls } from '../components';
import SessionDataR1 from '../assets/data/session-body-r1-1.json'
import { Vertex } from '../components/_p5';

const demoDataR1 = (props: LayoutsProps): ISessionData => {
  return {
    query: 'Kevin Bacon',
    dimensions: props.dimensions,
    apiStatus: props.apiStatus,
    vertices: SessionDataR1.vertices,
    edges: SessionDataR1.edges,
    properties: SessionDataR1.properties,
    queue: SessionDataR1.queue,
  };
}

const MemoSketch = memo(QuerySketch, (prevProps, nextProps) => {
  return prevProps.session == nextProps.session;
});

export const StuckSketchLayout: React.FC<LayoutsProps> = ({ dimensions, apiStatus }: LayoutsProps) => {
  const [sessionData, setSessionData] = useState<ISessionData>(demoDataR1({ dimensions, apiStatus }));
  const [curSeleVert, setCurSelVert] = useState<Vertex>();

  const handleClickedVert = (vert: Vertex) => {
    console.log(vert);
    setCurSelVert(vert);
  }

  return (
    <>
      <div id='sketch-layout-container'>
        {sessionData?.query == undefined ? <StandbySketch dimensions={dimensions} /> : <></>}
        {sessionData?.query != undefined ? <MemoSketch session={sessionData} handleClickedVert={handleClickedVert} /> : <></>}
        {sessionData?.query != undefined ? <ActiveQueryControls currentQuery={sessionData?.query} curSelVertex={curSeleVert} /> : <></>}
      </div>
      <Footer apiStatus={apiStatus} />
    </>
  );
};