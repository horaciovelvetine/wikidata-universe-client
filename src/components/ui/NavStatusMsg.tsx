import './NavStatusMsg.css'

import { createRef, FC, useEffect, useState } from 'react';

import { MainAppLayoutState } from '../../app/MainAppLayoutState';
import { RequestResponse } from '../../api';

interface NavStatusMsgProps {
  mainAppLayoutState: MainAppLayoutState,
  initSketchAPIRes: RequestResponse | null;
}

const prfx = (sufx: string) => {
  return `nav-status-msg-${sufx}`;
}

export const NavStatusMsg: FC<NavStatusMsgProps> = ({ mainAppLayoutState, initSketchAPIRes }) => {
  const exploreRef = createRef<HTMLLIElement>();
  const aboutRef = createRef<HTMLLIElement>();
  const settingsRef = createRef<HTMLLIElement>();
  const curQueryRef = createRef<HTMLSpanElement>();

  const [curQuery, setCurQuery] = useState<string | null>(null);

  useEffect(() => {
    if (mainAppLayoutState.showAboutSketch) {
      showHideDisplay(true, aboutRef.current!)
      return;
    }
    showHideDisplay(false, aboutRef.current!)
  }, [mainAppLayoutState.showAboutSketch])

  //* SHOW SETTINGS
  useEffect(() => {
    if (mainAppLayoutState.showSettings) {
      showHideDisplay(true, settingsRef.current!)
      return;
    }
    showHideDisplay(false, settingsRef.current!)
  }, [mainAppLayoutState.showSettings])

  //*MAIN APP 'EXPLORE'
  useEffect(() => {
    if (mainAppLayoutState.apiOnline && !mainAppLayoutState.showAboutSketch) {
      showHideDisplay(true, exploreRef.current!)
      return;
    }
    showHideDisplay(false, exploreRef.current!)
  }, [mainAppLayoutState])

  //*CURQUERY 
  useEffect(() => {
    if (initSketchAPIRes == null) {
      setCurQuery(null)
      return;
    }

    if (initSketchAPIRes && mainAppLayoutState.showAboutSketch) {
      setCurQuery(null);
      return;
    }

    if (initSketchAPIRes.data) {
      setCurQuery(initSketchAPIRes.data.query);
      curQueryRef.current!.style.opacity = '100%';
    }
  }, [initSketchAPIRes])

  const showHideDisplay = (show: boolean, ele: HTMLHeadElement) => {
    if (show) {
      ele.style.transform = 'translateY(-100%)';
    } else {
      ele.style.transform = 'translateY(0)';
    }
  }

  return (
    <div id={prfx('display')}>
      <ul id={prfx('list')}>
        <li ref={exploreRef}>
          <h2 id={prfx('explore')}>
            explore<span ref={curQueryRef}>: {curQuery}</span>
          </h2>
        </li>
        <li ref={aboutRef}>
          <h2 id={prfx('about')}>
            about
          </h2>
        </li>
        <li ref={settingsRef}>
          <h2 id={prfx('settings')} >
            settings
          </h2>
        </li>
      </ul>
    </div>
  );
};