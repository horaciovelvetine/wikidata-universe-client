import './_HoveredVertexDetailsStyle.css'
import React, { createRef, useEffect } from 'react';
import { Vertex as VertIcon, Settings } from '../assets/icons'
import { Vertex } from '../p5/models';
import { fadeInHoveredLabel } from './animations';

interface HoveredVertexDetailsProps {
  hoveredVertex: Vertex | null;
}

export const HoveredVertexDetails: React.FC<HoveredVertexDetailsProps> = ({ hoveredVertex }) => {
  const curHovRef = createRef<HTMLParagraphElement>();

  useEffect(() => {
    fadeInHoveredLabel(curHovRef.current!, !!hoveredVertex)
  }, [hoveredVertex])

  const hv = hoveredVertex?.xyz()!

  return (
    <div id='hovered-vertex-container'>
      <p id='cur-hovered' ref={curHovRef}> {hoveredVertex != null ? (
        <>
          <img id='cur-hov-icon' src={VertIcon} />
          <span id='cur-hov-label'>{hoveredVertex.label}</span>
          <span id='cur-hov-coords'><span id='attr-label'> @x_</span>{hv.x},<span id='attr-label'>y_</span>{hv.y}, <span id='attr-label'>z_</span>{hv.z} <span id='attr-label'></span></span>
        </>
      ) : ''}</p>
      <img id='app-settings-icon' src={Settings} />
    </div>
  );
};