import './_VerTextDetailsStyle.css';

import { Vertex } from '../p5/models';
import { rotateChevIcon, showHideAttrList } from './animations';
import React, { createRef, useEffect, useState } from 'react';
import ChevRightIcon from '../assets/icons/mi-chev-icon.svg';

interface VerTextDetailsProps {
  vertex: Vertex | null;
}

export const VerTextDetails: React.FC<VerTextDetailsProps> = ({ vertex }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const chevIconRef = createRef<HTMLImageElement>();
  const attrListRef = createRef<HTMLUListElement>();

  useEffect(() => {
    if (vertex == null) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [vertex]);

  useEffect(() => {
    rotateChevIcon(chevIconRef.current!, isOpen);
    showHideAttrList(attrListRef.current!, isOpen);
  }, [isOpen]);

  function handleVerTextToggleClick() {
    if (vertex == null) return; // no vertex to display
    setIsOpen(!isOpen);
  }

  return (
    <>
      <div id='vertext-info'>
        <ul id='attr-list' ref={attrListRef}>
          <li id='attr'>{vertex != null ? vertex.label.toLocaleLowerCase() + '.' : ''}</li>
          <li id='attr'>{vertex != null ? vertex.description.toLocaleLowerCase() : ''}</li>
        </ul>
        <button id='icon-btn' onClick={handleVerTextToggleClick} >
          <img src={ChevRightIcon} id='icon' ref={chevIconRef} alt='Chevron Icon Toggle Indicator' />
        </button>
      </div>
    </>);
};