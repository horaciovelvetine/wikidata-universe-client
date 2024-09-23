import './_VerTextDetailsStyle.css';
import React, { createRef, useEffect, useState } from 'react';

import { changeFocusOpacity, toggleSelectedVertexIcon, toggleVertextBackgrounds } from './animations';
import { Vertex as VertIcon, VertexSel } from '../assets/icons'
import { Vertex } from '../p5/models';


interface VerTextDetailsProps {
  selectedVertex: Vertex | null;
}

export const VerTextDetails: React.FC<VerTextDetailsProps> = ({ selectedVertex }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const vertextInfoRef = createRef<HTMLDivElement>();
  const noVertIconRef = createRef<HTMLImageElement>();
  const vertIconRef = createRef<HTMLImageElement>();

  useEffect(() => {
    if (selectedVertex == null) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [selectedVertex]);

  useEffect(() => {
    toggleVertextBackgrounds(vertextInfoRef.current!, isOpen)
    toggleSelectedVertexIcon(noVertIconRef.current!, vertIconRef.current!, isOpen)
    changeFocusOpacity(vertextInfoRef.current!, isOpen);
  }, [isOpen]);

  return (
    <>
      <div id='vertext-info' ref={vertextInfoRef}>

        <div id='vertext-details'>
          <a href={selectedVertex?.url()} target='_blank'>
            <div id='vertext-label'>
              {selectedVertex?.label}
            </div>
          </a>
          <div id='vertext-desc'>
            {selectedVertex?.description}
          </div>
        </div>

        <div id='vertext-icon-cont'>
          <img id='no-vertext-icon' src={VertIcon} ref={noVertIconRef} />
          <img id='vertext-icon' src={VertexSel} ref={vertIconRef} />
        </div>
      </div >
    </>);
};


