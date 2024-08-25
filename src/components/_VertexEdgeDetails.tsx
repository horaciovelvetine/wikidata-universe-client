import './_VertexEdgeDetailsStyle.css'
import React, { createRef, useEffect, useState } from 'react';
import { ArrowBoth, ArrowFrom, ArrowTo, Vertex as VertIcon } from '../assets/icons';
import { Vertex } from '../p5/models';

interface VertexEdgeDetailsProps {
  vertex: Vertex | null;
}

export const VertexEdgeDetails: React.FC<VertexEdgeDetailsProps> = ({ vertex }) => {
  const [isOnScreen, setIsOnScreen] = useState(false);

  const contRef = createRef<HTMLDivElement>();
  const edgesInfoRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (vertex == null) {
      setIsOnScreen(false);
    } else {
      setIsOnScreen(true);
    }
  }, [vertex])

  useEffect(() => {
    // animate refs...
  }, [isOnScreen])


  return (
    <div id='edges-info-container' ref={contRef}>
      {/* permanenet on screen */}
      <div id='edges-info' ref={edgesInfoRef}>
        {/* animate onto the screen when 'isOnScreen' */}
        <div id='edge-details'>
          <img id='vertex-icon' src={VertIcon} />
          <p>Charles</p>
          <img id='edge-icon' src={ArrowBoth} alt='parallel edge' />
          <p>Edge.B</p>
          <p>(property.label)</p>
        </div>
        <div id='edge-details'>
          <img id='vertex-icon' src={VertIcon} />
          <p>Charles</p>
          <img id='edge-icon' src={ArrowTo} alt='parallel edge' />
          <p>Edge.B</p>
          <p>(property.label)</p>
        </div>
        <div id='edge-details'>
          <img id='vertex-icon' src={VertIcon} />
          <p>Charles</p>
          <img id='edge-icon' src={ArrowTo} alt='parallel edge' />
          <p>Edge.B</p>
          <p>(property.label)</p>
        </div>
        <div id='edge-details'>
          <img id='vertex-icon' src={VertIcon} />
          <p>Charles</p>
          <img id='edge-icon' src={ArrowFrom} alt='parallel edge' />
          <p>Edge.B</p>
          <p>(property.label)</p>
        </div>
        <div id='title-container'>
          <p id='title'>edges_</p>
        </div>
      </div>
    </div>
  );
};