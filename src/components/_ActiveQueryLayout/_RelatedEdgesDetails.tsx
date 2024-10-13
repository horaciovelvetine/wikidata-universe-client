import './_RelatedEdgesDetailsStyle.css'
import React, { createRef, useEffect, useState } from 'react';
import { Edge, Vertex } from '../../p5/models';
import { SketchData } from '../../interfaces';
import { EdgeDetails } from './_EdgeDetails';
import { showHideRelatedEdges } from '../animations';

interface RelatedEdgesDetailsProps {
  selectedVertex: Vertex | null;
  sketchData: SketchData;
  adjustLookAtHandler: (otherVert: Vertex) => void;
}

export const RelatedEdgesDetails: React.FC<RelatedEdgesDetailsProps> = ({ selectedVertex, sketchData, adjustLookAtHandler }) => {
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [relatedEdges, setRelatedEdges] = useState<Edge[]>([])
  const contRef = createRef<HTMLDivElement>();
  const edgesInfoRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (selectedVertex == null) {
      setRelatedEdges([]);
      setIsOnScreen(false);
      return;
    }
    setRelatedEdges(selectedVertex.getRelatedEdges(sketchData));
    if (relatedEdges.length != 0) {
      setIsOnScreen(true);
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
        <div id='edges-info-container' ref={contRef}>
          <div id='edges-info' ref={edgesInfoRef} onWheel={blockWheelScrollDetailsHandler}>
            <ul id='details-list'>
              {relatedEdges?.map((edge, index) => (
                selectedVertex && <EdgeDetails key={index} {...{ edge, sketchData, selectedVertex, relatedEdges, adjustLookAtHandler }} />
              ))}
            </ul>
          </div>
        </div>
    </>
  );
}