import './WikiverseAppStyle.css';
import React, { useEffect, useState } from 'react';
import { ApiStatus, SessionData } from '../interfaces';
import { VerticalSiteTitle, Footer, VerTextDetails, HorizonSiteTitle, ActiveQueryControls } from '../components';
import { Vertex } from '../p5/models';
import { WikiverseSketch } from '../p5/WikiverseSketch';

import SessionDataMock from '../assets/data/session-body-r1-1.json';
import { calcSafeDimensions } from '../p5/functions';
import { Camera } from 'p5';

interface WikiverseAppProps {
  apiStatusRes: ApiStatus;
}

const session = (): SessionData => {
  return {
    query: 'Kevin Bacon',
    dimensions: calcSafeDimensions(),
    vertices: SessionDataMock.vertices,
    edges: SessionDataMock.edges,
    properties: SessionDataMock.properties,
    queue: SessionDataMock.queue,
  }
}

const WikiverseMemo = React.memo(WikiverseSketch, (prev, next) => {
  return prev.session === next.session;
});

export const WikiverseApp: React.FC<WikiverseAppProps> = ({ apiStatusRes }) => {
  const [sessionData, setSessionData] = useState(session());
  const [vertexSelected, setVertexSelected] = useState<Vertex | null>(null);
  const [cam, setCam] = useState<Camera>();

  const cameraFocusHandler = (target: string) => {
    sessionData.vertices.forEach((vertex) => {
      const vert = new Vertex(vertex);
      if (vert.label === target) {
        setVertexSelected(vert);
        cam?.lookAt(vert.coords.x, vert.coords.y, vert.coords.z);
        return true
      }
    });
    return false;
  };

  return (
    <div id='wikiverse-container'>
      <VerticalSiteTitle />
      <div id='sketch-container' style={{ width: sessionData.dimensions.width, height: sessionData.dimensions.height }}>
        <WikiverseMemo session={sessionData} setCurSelection={setVertexSelected} setCam={setCam} />
        <div id='sketch-overlay-bot'>
          <ActiveQueryControls curQuery={sessionData.query} camFocusHandler={cameraFocusHandler} />
          <VerTextDetails vertex={vertexSelected} />
        </div>
      </div>
      <Footer />
    </div>
  );
};
