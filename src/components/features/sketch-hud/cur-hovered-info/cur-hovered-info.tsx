import { Vertex as VertIcon } from '../../../../assets/icons';
import { Vertex, WikiverseSketch } from '../../../../types';
import { abridgeString } from '../../../../utils/abridge-string';
import { getMainDispDimensions } from '../../../../utils/get-main-disp-dimensions';
import { showHideCurHovered } from '../../animations/show-hide-cur-hovered';
import './cur-hovered-info.css'
import { createRef, FC, useState, useEffect } from "react";

const ID = (sufx: string) => `cur-hovered-info-${sufx}`

interface CurHoveredInfoProps {
  sketchRef: WikiverseSketch;
}

export const CurHoveredInfo: FC<CurHoveredInfoProps> = ({ sketchRef }) => {
  const [curHoveredRef, setCurHoveredRef] = useState<Vertex | null>(null);

  const containerRef = createRef<HTMLDivElement>();

  const [label, setLabel] = useState('');
  const [desc, setDesc] = useState('');
  const [coords, setCoords] = useState('')

  useEffect(() => { // resize listen to abridge description for dynamic container width...
    const handleResize = () => {
      setDesc(abridgeString(curHoveredRef?.description, getMainDispDimensions()))
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => { // lets sketch know to update component on state changes
    sketchRef.state.addCurHoveredSubscriber(setCurHoveredRef);
  })

  useEffect(() => {
    showHideCurHovered(curHoveredRef, containerRef)
    setDesc(abridgeString(curHoveredRef?.description, getMainDispDimensions()))
    setLabel(curHoveredRef?.label || '');
    setCoords(curHoveredRef?.coords.string() || '')
  }, [curHoveredRef, containerRef])

  return (
    <div id={ID('container')} ref={containerRef}>
      <div id={ID('layout')}>
        <div id={ID('icon-container')}>
          <img id={ID('icon')} src={VertIcon} />
        </div>
        <div id={ID('text-container')}>
          <div id={ID('title-span')}>
            <h2 id={ID('title')}>{label}</h2>
            <p id={ID('cur-hov-coords')}>{coords}</p>
          </div>
          <p id={ID('desc-abrdg')}>{desc}</p>
        </div>
      </div>
    </div>
  )
}