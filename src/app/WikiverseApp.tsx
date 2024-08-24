import './WikiverseAppStyle.css';
import React, { useEffect, useState } from 'react';
import { ApiStatus, SessionData } from '../interfaces';
import { VerticalSiteTitle, Footer, VerTextDetails, ActiveQueryControls } from '../components';
import { Vertex } from '../p5/models';
import { WikiverseSketch } from '../p5/WikiverseSketch';

import CharlesSessionDataR2 from '../assets/data/charles-data-r1-2.json';
import { calcSafeDimensions } from '../p5/functions';
import { Camera } from 'p5';
import { postRelatedDataQueue, postRelatedDataClick } from '../api';

interface WikiverseAppProps {
  apiStatusRes: ApiStatus;
}

const session = (): SessionData => {
  return {
    err: null,
    query: CharlesSessionDataR2.query,
    vertices: CharlesSessionDataR2.vertices,
    edges: CharlesSessionDataR2.edges,
    properties: CharlesSessionDataR2.properties,
    queue: CharlesSessionDataR2.queue,
    dimensions: calcSafeDimensions()
  }
}

const WikiverseMemo = React.memo(WikiverseSketch, (prev, next) => {
  return prev.session == next.session;
});

export const WikiverseApp: React.FC<WikiverseAppProps> = () => {
  const [sessionData, setSessionData] = useState(session());
  const [dimensions, setDimensions] = useState(calcSafeDimensions());
  const [vertexSelected, setVertexSelected] = useState<Vertex | null>(null);
  const [cam, setCam] = useState<Camera>();

  useEffect(() => {
    window.addEventListener('resize', () => setDimensions(calcSafeDimensions()));
    return () => window.removeEventListener('resize', () => setDimensions(calcSafeDimensions()));
  }, [])

  useEffect(() => {
    console.log('SessionData()', sessionData)
  }, [sessionData])

  useEffect(() => {
    console.log('VertexSelected()', vertexSelected)
  }, [vertexSelected])


  const cameraFocusHandler = (target: string): boolean => {
    let tgtInExistingSet = false;
    sessionData.vertices.forEach((vertex) => {
      const vert = new Vertex(vertex);
      if (vert.label === target) {
        setVertexSelected(vert);
        cam?.lookAt(vert.coords.x, vert.coords.y, vert.coords.z);
        tgtInExistingSet = true;
      }
    });
    return tgtInExistingSet;
  };

  const newQuerySubmitHandler = async (data: SessionData) => {
    const vert = new Vertex(data.vertices[0]);
    setSessionData(data);
    setVertexSelected(vert);
    console.log(await postRelatedDataQueue(data));
  };

  const newClickWhoDis = async (vert: Vertex | null) => {
    setVertexSelected(vert);
    if (vert == null) return;
    const originalQuery = sessionData.query; // preserve original value
    const payload = { ...sessionData, query: vert?.label }
    const res = await postRelatedDataClick(payload);
    if (res.status == 200) {
      let newSessionData: SessionData = { ...res.data as SessionData, query: originalQuery! };
      setSessionData(newSessionData)
    }
  }

  return (
    <div id='wikiverse-container'>
      <VerticalSiteTitle />
      <div id='sketch-container' style={{ width: dimensions.width, height: dimensions.height }}>
        <WikiverseMemo session={sessionData} clickHandler={newClickWhoDis} setCam={setCam} />
        <div id='sketch-overlay-bot'>
          <ActiveQueryControls curQuery={sessionData.query} camFocusHandler={cameraFocusHandler} newQueryHandler={newQuerySubmitHandler} />
          <VerTextDetails vertex={vertexSelected} />
        </div>
      </div>
      <Footer />
    </div>
  );
};
