import './SelectedVertexDetails.css'
import { VertexSel } from '../../../../assets/icons'

import { createRef, FC, useEffect } from 'react';
import { Vertex } from '../../../models';

interface SelectedVertexDetailsProps {
  selectedVertex: Vertex | null;
}

const prfx = (sufx: string) => {
  return 'selected-vertex-details-' + sufx;
}

export const SelectedVertexDetails: FC<SelectedVertexDetailsProps> = ({ selectedVertex }) => {
  const displayRef = createRef<HTMLDivElement>();
  const selIconRef = createRef<HTMLImageElement>();
  const textContRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!displayRef.current) return;
    if (selectedVertex == null) {
      displayRef.current.style.transform = 'translateY(100%)';
    } else {
      displayRef.current.style.transform = 'translateY(0)';
    }
  }, [selectedVertex])

  const label = selectedVertex ? (selectedVertex.label || selectedVertex.id) : '';
  const coords = selectedVertex ? selectedVertex.coordsStr() : '';
  const desc = selectedVertex ? selectedVertex.description : '';

  return (
    <div id={prfx('display')} ref={displayRef} onWheel={(e) => { e.stopPropagation() }} onClick={(e => e.stopPropagation)}>
      <div id={prfx('icon-cont')}>
        <img id={prfx('selected-icon')} src={VertexSel} ref={selIconRef} />
      </div>
      <div id={prfx('text-cont')} ref={textContRef}>
        <a id={prfx('label-link')} href={selectedVertex?.url()} target='_blank'>
          <div id={prfx('label-text-cont')}>
            <p id={prfx('label')}>{label}</p>
            <p id={prfx('coords')}>{coords}</p>
          </div>
        </a>
        <p id={prfx('description')}>{desc}</p>
      </div>
    </div>
  );
};