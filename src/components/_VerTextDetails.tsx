import './_VerTextDetailsStyle.css';

import { Vertex } from '../p5/models';
import { changeFocusOpacity, flashNoneSelectedMsg, flashOverlayElement, rotateChevIcon, showHideAttrList } from './animations';
import React, { createRef, useEffect, useState } from 'react';
import ChevIcon from '../assets/icons/mi-chev-icon.svg';
import ChevDangerIcon from '../assets/icons/mi-chev-icon-danger.svg';
import LinkIcon from '../assets/icons/mi-link-icon.svg';

interface VerTextDetailsProps {
  vertex: Vertex | null;
}

export const VerTextDetails: React.FC<VerTextDetailsProps> = ({ vertex }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const chevIconRef = createRef<HTMLImageElement>();
  const chevDangRef = createRef<HTMLImageElement>();
  const noCurSelRef = createRef<HTMLParagraphElement>();
  const attrListRef = createRef<HTMLUListElement>();
  const vertextInfoRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (vertex == null) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [vertex]);

  useEffect(() => {
    rotateChevIcon(chevIconRef.current!, isOpen, '0.35s');
    rotateChevIcon(chevDangRef.current!, isOpen, '0.35s');
    showHideAttrList(attrListRef.current!, isOpen, '0.35s');
    changeFocusOpacity(vertextInfoRef.current!, isOpen, '0.35s', '1', '0.45');
  }, [isOpen]);

  function handleVerTextToggleClick() {
    if (vertex == null) {
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
            <li id='attr'>{vertex != null ? <><span id='attr-lbl'>label_ </span>{vertex.label}</> : ''}</li>
            <li id='attr'>{vertex != null ? <><span id='attr-lbl'>desc_ </span> {vertex.description}</> : ''}</li>
            <li id='attr'>{vertex != null ? <a id='attr-link' href={vertex != null ? vertex.url() : ''} target='_blank' rel='noreferrer'>
              <img src={LinkIcon} id='attr-link-icon' alt='Wikipedia link icon' />
            </a> : ''}
            </li>
          </ul>
          <p id='no-cur-sel-msg' ref={noCurSelRef}>no vertex selected</p>
        </div>
        <button id='icon-btn' onClick={handleVerTextToggleClick} >
          <div id='icon-container'>
            <img src={ChevDangerIcon} id='icon-danger' ref={chevDangRef} alt='Invalid action indicator' />
            <img src={ChevIcon} id='icon' ref={chevIconRef} alt='Chevron toggle indicator' />
          </div>
        </button>
      </div>
    </>);
};