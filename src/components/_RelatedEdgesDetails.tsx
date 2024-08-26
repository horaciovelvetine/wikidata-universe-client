import './_RelatedEdgesDetailsStyle.css'
import React, { createRef, useEffect, useState } from 'react';
import { Edge, Vertex } from '../p5/models';
import { iEdge, SketchData } from '../interfaces';
import { EDGE_TYPE, EdgeDetails } from './_EdgeDetails';

interface RelatedEdgesDetailsProps {
  vertex: Vertex | null;
  data: SketchData | undefined;
}

export const RelatedEdgesDetails: React.FC<RelatedEdgesDetailsProps> = ({ vertex, data }) => {
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [relatedEdges, setRelatedEdges] = useState<Edge[]>([])
  const contRef = createRef<HTMLDivElement>();
  const edgesInfoRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (vertex != null) {
      setRelatedEdges(vertex.getRelatedEdges(data!))
      setIsOnScreen(true);
    } else {
      setRelatedEdges([])
      setIsOnScreen(false);
    }
  }, [vertex])

  useEffect(() => {
    // animate refs...
  }, [isOnScreen])
  useEffect(() => {
    console.log('related edges changes:', relatedEdges)
  }, [relatedEdges])



  return (
    <div id='edges-info-container' ref={contRef}>
      {/* permanenet on screen */}
      <div id='edges-info' ref={edgesInfoRef}>
        <ul id='details-list'>
          {/* {relatedEdges.map((edge, index) => (
            <EdgeDetails key={index} edge={edge} data={data} />
          ))} */}
        </ul>
      </div>
    </div>
  );
}