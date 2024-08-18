import './WikiverseAppStyle.css';
import React, { useEffect, useState } from 'react';
import { ApiStatus, SessionData } from '../interfaces';
import { VerticalSiteTitle, Footer, VerTextDetails, HorizonSiteTitle } from '../components';
import { Vertex } from '../p5/models';
import { WikiverseSketch } from '../p5/WikiverseSketch';

import SessionDataMock from '../assets/data/session-body-r1-1.json';
import { calcSafeDimensions } from '../p5/functions';

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

  return (
    <div id='wikiverse-container'>
      <VerticalSiteTitle />
      <div id='sketch-container' style={{ width: sessionData.dimensions.width, height: sessionData.dimensions.height }}>
        <WikiverseMemo session={sessionData} setCurSelection={setVertexSelected} />
        <div id='sketch-overlay-bot'>
          <VerTextDetails vertex={vertexSelected} />
        </div>
      </div>
      <Footer />
    </div>
  );
};
