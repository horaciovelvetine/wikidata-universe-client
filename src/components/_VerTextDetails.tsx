import './_VerTextDetailsStyle.css';
import React, { createRef, useEffect, useState } from 'react';

import { changeFocusOpacity, flashNoneSelectedMsg, flashOverlayElement, rotateChevIcon, showHideAttrList } from './animations';
import { Chev, ChevDngr, Link } from '../assets/icons'
import { Vertex } from '../p5/models';


interface VerTextDetailsProps {
  selectedVertex: Vertex | null;
}

export const VerTextDetails: React.FC<VerTextDetailsProps> = ({ selectedVertex }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const chevIconRef = createRef<HTMLImageElement>();
  const chevDangRef = createRef<HTMLImageElement>();
  const noCurSelRef = createRef<HTMLParagraphElement>();
  const attrListRef = createRef<HTMLUListElement>();
  const vertextInfoRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (selectedVertex == null) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [selectedVertex]);

  useEffect(() => {
    rotateChevIcon(chevIconRef.current!, isOpen, '0.35s');
    rotateChevIcon(chevDangRef.current!, isOpen, '0.35s');
    showHideAttrList(attrListRef.current!, isOpen, '0.35s');
    changeFocusOpacity(vertextInfoRef.current!, isOpen, '0.35s', '1', '0.45');
  }, [isOpen]);

  function handleVerTextToggleClick() {
    if (selectedVertex == null) {
      flashNoneSelectedMsg(noCurSelRef.current!, 1000);
      flashOverlayElement(chevDangRef.current!, chevIconRef.current!, 1000);
      return
    }; // no vertex to display
    setIsOpen(!isOpen);
  }

  return (
    <>
      <div id='vertext-info' ref={vertextInfoRef}>
        <div id='vertext-container'>
          <ul id='attr-list' ref={attrListRef}>
            <li id='attr'>{selectedVertex != null ? <><span id='attr-lbl'>label_ </span>{selectedVertex.label}</> : ''}</li>
            <li id='attr'>{selectedVertex != null ? <><span id='attr-lbl'>desc_ </span> {selectedVertex.description}</> : ''}</li>
            <li id='attr'>{selectedVertex != null ? <a id='attr-link' href={selectedVertex != null ? selectedVertex.url() : ''} target='_blank' rel='noreferrer' >
              <img src={Link} id='attr-link-icon' alt='Wikipedia link icon' />
            </a> : ''}
            </li>
          </ul>
          <p id='no-cur-sel-msg' ref={noCurSelRef}>no vertex selected</p>
        </div>
        <button id='icon-btn' onClick={handleVerTextToggleClick} >
          <div id='icon-container'>
            <img src={ChevDngr} id='icon-danger' ref={chevDangRef} alt='Invalid action indicator' />
            <img src={Chev} id='icon' ref={chevIconRef} alt='Chevron toggle indicator' />
          </div>
        </button>
      </div>
    </>);
};


