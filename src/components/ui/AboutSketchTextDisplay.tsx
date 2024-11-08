import './AboutSketchTextDisplay.css'

import { createRef, FC, useEffect, useState } from 'react';

import { RequestResponse } from '../../api';
import { MainAppLayoutState } from '../../app/MainAppLayoutState';

const prfx = (sufx: string) => {
  return `about-${sufx}`;
}

interface AboutOnScreenMsgProps {
  mainAppLayoutState: MainAppLayoutState,
  initSketchAPIRes: RequestResponse | null
}

export const AboutSketchTextDisplay: FC<AboutOnScreenMsgProps> = ({ mainAppLayoutState }) => {
  const displayRef = createRef<HTMLDivElement>();
  const [header, setHeader] = useState<string | null>(null);
  const [mainText, setMainText] = useState<string | null>(null);
  const [instruct, setInstruct] = useState<string | null>(null);

  useEffect(() => {
    const ref = displayRef.current!
    setTimeout(() => {
      ref.style.opacity = '100%';
    }, 15)
  }, [])

  useEffect(() => {
    if (mainAppLayoutState.aboutSketchText) {
      const splitTxt = mainAppLayoutState.aboutSketchText.split('::');
      setHeader(splitTxt.at(1)!);
      setMainText(splitTxt.at(2)!);
      setInstruct(splitTxt.at(3)!.toLowerCase());
      return;
    }
    setHeader(null);
    setMainText(null);
    setInstruct(null);
  }, [mainAppLayoutState.aboutSketchText])

  return (
    <div id={prfx('display')} ref={displayRef}>
      <div id={prfx('container')}>
        <div id={prfx('text-container')}>
          <div id={prfx('header-cont')}>
            <h2 id={prfx('header')}>
              {header}
            </h2>
          </div>
          <div id={prfx('main-text-cont')}>
            <p id={prfx('main-text')}>{mainText}</p>
          </div>
        </div>
        <div id={prfx('action-instruct-cont')}>
          <p id={prfx('action-instruct')}>[{instruct}]</p>
        </div>
      </div>
    </div>
  );
};