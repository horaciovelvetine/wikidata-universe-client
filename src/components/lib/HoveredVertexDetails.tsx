import './HoveredVertexDetails.css'
import { Vertex as VertIcon } from '../../assets/icons';

import React, { createRef, useEffect } from 'react';

import { Vertex } from '../../models/Vertex';
import { toggleElementOpacity } from '../';

interface HoveredVertexDetailsProps {
  hoveredVertex: Vertex | null;
}

const prfx = (sufx: string) => {
  return 'hovered-vertex-' + sufx;
}

export const HoveredVertexDetails: React.FC<HoveredVertexDetailsProps> = ({ hoveredVertex }) => {
  const hoveredDetailsEleRef = createRef<HTMLDivElement>();

  useEffect(() => {
    toggleElementOpacity(hoveredDetailsEleRef.current!, !!hoveredVertex, '150ms')
  }, [hoveredVertex])

  const label = hoveredVertex ? hoveredVertex?.label : "";
  const description = hoveredVertex ? hoveredVertex?.description : "";
  const coords = hoveredVertex ? hoveredVertex?.coordsStr() : "";

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