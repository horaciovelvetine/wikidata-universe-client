import './_HoveredVertexDetailsStyle.css'
import React, { createRef, useEffect } from 'react';
import { Vertex as VertIcon } from '../../assets/icons'
import { Vertex } from '../../p5/models';
import { fadeInHoveredLabel } from '../animations';

interface HoveredVertexDetailsProps {
  hoveredVertex: Vertex | null;
}

export const HoveredVertexDetails: React.FC<HoveredVertexDetailsProps> = ({ hoveredVertex }) => {
  const curHovRef = createRef<HTMLParagraphElement>();

  useEffect(() => {
    fadeInHoveredLabel(curHovRef.current!, !!hoveredVertex)
  }, [hoveredVertex])

  return (
    <div id='hovered-vertex-container'>
      <div id='cur-hovered' ref={curHovRef}> {hoveredVertex != null ? (
        <>
          <img id='cur-hov-icon' src={VertIcon} />
          <div id='cur-hov-text-container'>
            <p id='cur-hov-label'>{hoveredVertex.label}:</p>
            <p id='cur-hov-desc'>{hoveredVertex.description}</p>
          </div>
        </>
      ) : <></>}</div>
    </div>
  );
};