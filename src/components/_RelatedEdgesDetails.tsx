import './_RelatedEdgesDetailsStyle.css'
import React, { createRef, useEffect, useState } from 'react';
import { Edge, Vertex } from '../p5/models';
import { SketchData } from '../interfaces';
import { EdgeDetails } from '../components';
import { showHideRelatedEdges } from './animations';

interface RelatedEdgesDetailsProps {
  selectedVertex: Vertex;
  sketchData: SketchData;
  adjustLookAtHandler: (otherVert: Vertex) => void;
}

export const RelatedEdgesDetails: React.FC<RelatedEdgesDetailsProps> = ({ selectedVertex, sketchData, adjustLookAtHandler }) => {
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [relatedEdges, setRelatedEdges] = useState<Edge[] | null>(null)
  const contRef = createRef<HTMLDivElement>();
  const edgesInfoRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (selectedVertex != null) {
      setRelatedEdges(selectedVertex.getRelatedEdges(sketchData!))
      setIsOnScreen(true);
    } else {
      setRelatedEdges(null)
      setIsOnScreen(false);
    }
  }, [selectedVertex])

  useEffect(() => {
    if (selectedVertex == null) return;
    showHideRelatedEdges(contRef.current!, isOnScreen)
  }, [isOnScreen])

  const blockWheelScrollDetailsHandler = (event: React.WheelEvent) => {
    event.stopPropagation(); // prevent scroll when hovering details...
  }

  return (
    <>
      {selectedVertex == null ? <></> : <>
        <div id='edges-info-container' ref={contRef}>
          <div id='edges-info' ref={edgesInfoRef} onWheel={blockWheelScrollDetailsHandler}>
            <ul id='details-list'>
              {relatedEdges?.map((edge, index) => (
                <EdgeDetails key={index} {...{ edge, sketchData, selectedVertex, relatedEdges, adjustLookAtHandler }} />
              ))}
            </ul>
          </div>
        </div>
      </>}
    </>
  );
}