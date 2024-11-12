import './NavMenuStatusDisplay.css'

import { createRef, FC, useEffect, useState } from 'react';

import { MainAppLayoutState } from '../../app/MainAppLayoutState';
import { RequestResponse } from '../../api';

interface NavMenuStatusDisplayProps {
  mainAppLayoutState: MainAppLayoutState,
  initSketchAPIRes: RequestResponse | null;
}

const prfx = (sufx: string) => {
  return `nav-status-msg-${sufx}`;
}

export const NavMenuStatusDisplay: FC<NavMenuStatusDisplayProps> = ({ mainAppLayoutState, initSketchAPIRes }) => {
  const exploreRef = createRef<HTMLLIElement>();
  const aboutRef = createRef<HTMLLIElement>();
  const settingsRef = createRef<HTMLLIElement>();
  const exploreMsgRef = createRef<HTMLSpanElement>();
  const aboutMsgRef = createRef<HTMLSpanElement>();

  const [navMsg, setNavMsg] = useState<string | null>();
  const [exploreMsg, setExploreMsg] = useState<string | null>();

  const showHideNavListItem = (show: boolean, ele: HTMLHeadElement) => {
    if (show) {
      ele.style.transform = 'translateY(-110%)';
    } else {
      ele.style.transform = 'translateY(0)';
    }
  }

  //* SHOW ABOUT SKETCH
  useEffect(() => {
    if (mainAppLayoutState.showAboutSketch) {
      showHideNavListItem(true, aboutRef.current!)
      return;
    }
    showHideNavListItem(false, aboutRef.current!)
  }, [mainAppLayoutState.showAboutSketch])

  //* SHOW SETTINGS
  useEffect(() => {
    if (mainAppLayoutState.showSettings) {
      showHideNavListItem(true, settingsRef.current!)
      return;
    }
    showHideNavListItem(false, settingsRef.current!)
  }, [mainAppLayoutState.showSettings])

  //*MAIN APP 'EXPLORE'
  useEffect(() => {
    if (mainAppLayoutState.apiOnline && !mainAppLayoutState.showAboutSketch) {
      showHideNavListItem(true, exploreRef.current!)
      return;
    }
    showHideNavListItem(false, exploreRef.current!)
  }, [mainAppLayoutState])

  //* NAV STATUS MSG VALUE STATE VALUE
  useEffect(() => {
    aboutMsgRef.current!.style.opacity = '0%';
    setNavMsg(mainAppLayoutState.navStatusMessage)
    if (mainAppLayoutState.navStatusMessage) {
      aboutMsgRef.current!.style.opacity = '100%';
    }
  }, [mainAppLayoutState.navStatusMessage])

  //* CURRENT QUERY EXPLORE TEXT VALUE
  useEffect(() => {
    exploreMsgRef.current!.style.opacity = '0%';
    if (mainAppLayoutState.showAboutSketch) {
      setExploreMsg(null);
      return;
    }
    const curQueryVal = initSketchAPIRes?.data.query
    setExploreMsg(curQueryVal)
    if (curQueryVal) {
      exploreMsgRef.current!.style.opacity = '100%';
    }
  }, [initSketchAPIRes, mainAppLayoutState])

  return (
    <div id={prfx('display')} >
      <ul id={prfx('list')}>
        <li ref={exploreRef} id={prfx('explrore-nav')}>
          <h2 id={prfx('explore')}>
            explore
            <span ref={exploreMsgRef} id={prfx('explore-cont')}>
              {": " + exploreMsg}
            </span>
          </h2>
        </li>
        <li ref={aboutRef} id={prfx('about-nav')}>
          <h2 id={prfx('about')}>
            tutorial<span ref={aboutMsgRef}>: {navMsg}</span>
          </h2>
        </li>
        <li ref={settingsRef} id={prfx('settings-nav')}>
          <h2 id={prfx('settings')} >
            settings
          </h2>
        </li>
      </ul>
    </div>
  );
};