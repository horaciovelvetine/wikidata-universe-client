import './HoveredVertexDetailsDisplay.css'
import { Vertex as VertIcon } from '../../assets/icons';

import React, { createRef, useEffect } from 'react';

import { Vertex } from '../../p5/models';
import { toggleElementOpacity } from '../';

interface HoveredVertexDetailsDisplayProps {
  hoveredVertex: Vertex | null;
}

const prfx = (sufx: string) => {
  return 'hovered-vertex-' + sufx;
}

export const HoveredVertexDetailsDisplay: React.FC<HoveredVertexDetailsDisplayProps> = ({ hoveredVertex }) => {
  const hoveredDetailsEleRef = createRef<HTMLDivElement>();

  useEffect(() => {
    toggleElementOpacity(hoveredDetailsEleRef.current!, !!hoveredVertex, '150ms')
  }, [hoveredVertex])

  const label = hoveredVertex ? hoveredVertex?.label : "";
  const description = hoveredVertex ? hoveredVertex?.description : "";
  const coords = hoveredVertex ? `(x: ${Math.round(hoveredVertex?.coords.x)}, y: ${Math.round(hoveredVertex?.coords.y)}, z: ${Math.round(hoveredVertex?.coords.z)})` : "";

  return (
    <div id={prfx('details-display')} ref={hoveredDetailsEleRef}>
      <div id={prfx('display-cont')}>
        <img id={prfx('display-icon')} src={VertIcon} />
        <div id={prfx('display-text')}>
          <p id={prfx('label')}>{label} <span id={prfx('coords')}>{coords}</span></p>
          <p id={prfx('description')}>{description}</p>
        </div>
      </div>
    </div>
  );
};