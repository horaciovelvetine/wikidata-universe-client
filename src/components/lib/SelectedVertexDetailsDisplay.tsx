import './SelectedVertexDetailsDisplay.css'
import { Vertex as VertexIcon, VertexSel } from '../../assets/icons'

import { createRef, FC, useEffect } from 'react';
import { Vertex } from '../../models';

interface SelectedVertexDetailsDisplayProps {
  selectedVertex: Vertex | null;
}

const prfx = (sufx: string) => {
  return 'selected-vertex-details-' + sufx;
}

const toggleSelectedVertexIcon = (noSelIcon: HTMLElement, selIcon: HTMLElement, isOpen: boolean, duration: number = 235) => {
  const transition = `opacity ${duration}ms linear`;
  noSelIcon.style.transition = transition;
  selIcon.style.transition = transition;
  if (isOpen) {
    selIcon.style.opacity = '1';
    noSelIcon.style.opacity = '0';
  } else {
    selIcon.style.opacity = '0';
    noSelIcon.style.opacity = '1';
  }
}

export const SelectedVertexDetailsDisplay: FC<SelectedVertexDetailsDisplayProps> = ({ selectedVertex }) => {
  const displayRef = createRef<HTMLDivElement>();
  const noneSelIconRef = createRef<HTMLImageElement>();
  const selIconRef = createRef<HTMLImageElement>();
  const textContRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!selectedVertex) {
      toggleSelectedVertexIcon(noneSelIconRef.current!, selIconRef.current!, false)
    } else {
      toggleSelectedVertexIcon(noneSelIconRef.current!, selIconRef.current!, true)
    }
  }, [selectedVertex])

  const label = selectedVertex ? (selectedVertex.label || selectedVertex.id) : 'no-selection';
  const coords = selectedVertex ? selectedVertex.coordsStr() : '';
  const desc = selectedVertex ? selectedVertex.description : '';

  return (
    <div id={prfx('display')} ref={displayRef}>
      <div id={prfx('icon-cont')}>
        <img id={prfx('none-selected-icon')} src={VertexIcon} ref={noneSelIconRef} />
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