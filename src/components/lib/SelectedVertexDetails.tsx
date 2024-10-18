import './SelectedVertexDetails.css'
import { Vertex as VertexIcon, VertexSel } from '../../assets/icons'

import { createRef, FC, useEffect } from 'react';
import { SessionSettingsState } from '../../interfaces';
import { Vertex } from '../../models/Vertex';

interface SelectedVertexDetailsProps {
  sessionSettingsState: SessionSettingsState;
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

export const SelectedVertexDetails: FC<SelectedVertexDetailsProps> = ({ sessionSettingsState, selectedVertex }) => {
  const { activeQuerySession } = sessionSettingsState;
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

  useEffect(() => {
    if (!displayRef.current) return;
    // The scoot the bitch side ways protocol...
    const transition = 'transform 500ms cubic-bezier(0.4, 0.0, 0.2, 1)';
    displayRef.current.style.transition = transition;
    if (activeQuerySession) {
      displayRef.current.style.transform = 'translateX(0)';
    } else {
      displayRef.current.style.transform = 'translateX(-100%)';
    }

  }, [activeQuerySession])

  const label = selectedVertex ? (selectedVertex.label || selectedVertex.id) : '';
  const coords = selectedVertex ? selectedVertex.coordsStr() : '';
  const desc = selectedVertex ? selectedVertex.description : '';

  return (
    <div id={prfx('display')} ref={displayRef} onWheel={(e) => { e.stopPropagation() }}>
      <div id={prfx('icon-cont')}>
        <img id={prfx('selected-icon')} src={VertexSel} ref={selIconRef} />
        <img id={prfx('none-selected-icon')} src={VertexIcon} ref={noneSelIconRef} />
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