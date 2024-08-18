import './_VerTextDetailsStyle.css';

import { Vertex } from '../p5/models';
import { rotateChevIcon } from './animations';
import React, { createRef } from 'react';
import ChevRightIcon from '../assets/icons/mi-chev-icon.svg';

interface VerTextDetailsProps {
  vertex: Vertex | null;
}

export const VerTextDetails: React.FC<VerTextDetailsProps> = ({ vertex }) => {
  const chevIconRef = createRef<HTMLImageElement>();

  function handleVerTextToggleClick() {
    rotateChevIcon(chevIconRef.current!, vertex != null);
  }

  return (
    <>
      <div id='vertext-info'>
        <ul id='vertext-attr-list'>
          <li id='vertext-attr'>{vertex != null ? vertex.label.toLocaleLowerCase() + '.' : ''}</li>
          <li id='vertext-attr'>{vertex != null ? vertex.description.toLocaleLowerCase() : ''}</li>
        </ul>
        <button id='vertext-icon-btn' onClick={handleVerTextToggleClick} >
          <img src={ChevRightIcon} id='vertext-icon' ref={chevIconRef} alt='Chevron Icon Toggle Indicator' />
        </button>
      </div>
    </>);
};