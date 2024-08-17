import './WikiverseAppStyle.css';
import React, { useState } from 'react';
import { ApiStatus, SessionData } from '../interfaces';
import { VerticalSiteTitle, Footer } from '../components';
import { Vertex } from '../p5/models';
import { WikiverseSketch } from '../p5/WikiverseSketch';

import SessionDataMock from '../assets/data/session-body-r1-1.json';

interface WikiverseAppProps {
  apiStatusRes: ApiStatus;
}

const res1: SessionData = {
  query: 'Kevin Bacon',
  vertices: SessionDataMock.vertices,
  edges: SessionDataMock.edges,
  properties: SessionDataMock.properties,
  queue: SessionDataMock.queue,
};

export const WikiverseApp: React.FC<WikiverseAppProps> = ({ apiStatusRes }) => {
  const [query, setQuery] = useState<string>(res1.query!);
  const [curSelVertex, setCurSelVertex] = useState<Vertex>();

  return (
    <>
      <VerticalSiteTitle />
      <WikiverseSketch session={res1} />
      <Footer />
    </>
  );
};
