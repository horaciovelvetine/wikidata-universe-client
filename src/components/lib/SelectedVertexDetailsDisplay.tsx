import './SelectedVertexDetailsDisplay.css'
import { Vertex as VertexIcon } from '../../assets/icons'

import { createRef, FC, useEffect } from 'react';
import { Vertex } from '../../models';

interface SelectedVertexDetailsDisplayProps {
  selectedVertex: Vertex | null;
}

const prfx = (sufx: string) => {
  return 'selected-vertex-details-' + sufx;
}

export const SelectedVertexDetailsDisplay: FC<SelectedVertexDetailsDisplayProps> = ({ selectedVertex }) => {
  const displayRef = createRef<HTMLDivElement>()

  useEffect(() => { }, [selectedVertex])

  const label = selectedVertex ? (selectedVertex.label || selectedVertex.id) : 'no-selection';

  return (
    <div id={prfx('display')} ref={displayRef}>
      <div id={prfx('cont')}>
        <a id={prfx('label-link')} href={selectedVertex?.url()} target='_blank'>
          <div id={prfx('label-text-cont')}>
            <p id={prfx('label')}>{label}</p>
            <p id={prfx('coords')}></p>
          </div>
        </a>
      </div>
    </div>
  );
};