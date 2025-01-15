import './cur-selected-info.css'
import { createRef, FC, useEffect, useState } from "react";

import { Vertex as NoVertSel, VertexSel } from '../../../../assets/icons';
import { Vertex, WikiverseSketch } from '../../../../types';

import { swapCurSelectedVertexIcons } from '../../animations/swap-cur-selected-vertex-icons';

interface CurSelectedInfoProps {
  sketchRef: WikiverseSketch;
}

const ID = (sufx: string) => `cur-selected-info-${sufx}`

export const CurSelectedInfo: FC<CurSelectedInfoProps> = ({ sketchRef }) => {
  const [curSelectedRef, setCurSelectedRef] = useState<Vertex | null>(sketchRef.state.curSelected());

  const [label, setLabel] = useState('')
  const [desc, setDesc] = useState('')
  const [coords, setCoords] = useState('')

  const iconRef = createRef<HTMLImageElement>()
  const selectedIconRef = createRef<HTMLImageElement>()

  useEffect(() => {
    sketchRef.state.addCurSelectedSubscriber(setCurSelectedRef);
  })

  useEffect(() => {
    setLabel(curSelectedRef?.label || '');
    setDesc(curSelectedRef?.description || '');
    setCoords(curSelectedRef?.coords.string() || '');
    swapCurSelectedVertexIcons(iconRef, selectedIconRef, curSelectedRef)
  }, [curSelectedRef, iconRef, selectedIconRef])

  return (
    <div id={ID('container')}>
      <div id={ID('layout')}>
        <div id={ID('icon-container')}>
          <img id={ID('vertex-icon')} src={NoVertSel} ref={iconRef} />
          <img id={ID('selected-icon')} src={VertexSel} ref={selectedIconRef} />
        </div>
        <div id={ID('text-container')}>
          <div id={ID('title-span')}>
            <a id={ID('label-link')} href={curSelectedRef?.url()} target='_blank'>{label}</a>
            <p id={ID('cur-sel-coords')}>{coords}</p>
          </div>
          <p id={ID('topic-desc')}>{desc}</p>
        </div>
      </div>
    </div >
  )
}