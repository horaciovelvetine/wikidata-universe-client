import './MainAppLayout.css'
import { MainAppLayoutState } from './MainAppLayoutState';

import React, { createRef, useEffect, useState, memo } from 'react';

import { Footer, VerticalSiteTitle, ApiOfflineNotice, SessionSettingsMenu, LoadingBar, HoveredVertexDetails, InitializeQuerySessionInput, GraphsetDetailsSummary, SelectedVertexDetails, toggleElementOpacity, BackgroundSketch, WikiverseSketch, RelatedEdgesDetails, calcSafeSketchWindowSize, AboutSketch, AboutSketchTextDisplay, NavMenuStatusDisplay } from '../components';
import { Dimensions, SketchManager, Vertex } from '../models';
import { RequestResponse } from '../api';


interface MainAppLayoutProps {
  apiStatusResponse: RequestResponse
}

// Ignore-rerenders, handlesResize() => { }
const BackgroundSketchMemo = memo(BackgroundSketch, () => { return true; });

// locks re-render only on resetting of initResponse...
const WikiverseSketchMemo = memo(WikiverseSketch, (prevProps, nextProps) => {
  return prevProps.initSketchAPIRes == nextProps.initSketchAPIRes;
})

const AboutSketchMemo = memo(AboutSketch, () => {
  return true;
})

export const MainAppLayout: React.FC<MainAppLayoutProps> = ({ apiStatusResponse }) => {
  const bgSketchRef = createRef<HTMLDivElement>();

  const apiOffline = apiStatusResponse.status != 200;
  const apiOnline = apiStatusResponse.status == 200;
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>(calcSafeSketchWindowSize())

  // REACT APP LAYOUT STATE
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const [showAboutSketch, setShowAboutSketch] = useState(false);
  const [aboutSketchText, setAboutSketchText] = useState<string | null>(null);
  const [showAboutSketchText, setShowAboutSketchText] = useState(false);
  const [navStatusMessage, setNavStatusMessage] = useState<string | null>(null)
  const [showWikiverseSketch, setShowWikiverseSketch] = useState(false);
  // WIKIVERSE SKETCH STATE
  const [initSketchAPIRes, setInitSketchAPIRes] = useState<RequestResponse | null>(null);
  const [p5SketchRef, setP5SketchRef] = useState<SketchManager | null>(null);
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);

  const mainAppLayoutState: MainAppLayoutState = {
    apiOnline, apiOffline,
    isLoading, setIsLoading,
    showSettings, setShowSettings,
    showDebugDetails, setShowDebugDetails,
    showAboutSketch, setShowAboutSketch,
    aboutSketchText, setAboutSketchText,
    selectedVertex, setSelectedVertex,
    hoveredVertex, setHoveredVertex,
    p5SketchRef, setP5SketchRef,
    showWikiverseSketch, setShowWikiverseSketch,
    navStatusMessage, setNavStatusMessage,
    showAboutSketchText, setShowAboutSketchText
  }

  useEffect(() => {
    window.addEventListener('resize', () => setContainerDimensions(calcSafeSketchWindowSize()))
    return () => window.removeEventListener('resize', () => setContainerDimensions(calcSafeSketchWindowSize()))
  }, [])

  useEffect(() => {
    if (initSketchAPIRes) {
      toggleElementOpacity(bgSketchRef.current!, false, '1000ms');
    } else {
      toggleElementOpacity(bgSketchRef.current!, true, '250ms');
    }
  }, [initSketchAPIRes, bgSketchRef]);

  return (
    <div id='wikiverse-main'>
      <LoadingBar isLoading={isLoading} />
      {/* SITE UI UNCLIPPED DIV */}
      <div id='unclipped-query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>
        <VerticalSiteTitle />
        <NavMenuStatusDisplay {...{ mainAppLayoutState, initSketchAPIRes }} />
      </div>

      <div id='unclipped-query-mask' style={{ width: containerDimensions.width, height: containerDimensions.height }}>
        {/* Dark BG DIV contains no elements */}
      </div>

      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>
        {/* QUERY SKETCH OVERLAY TOP */}
        <div id='sketch-overlay-top'>
          <HoveredVertexDetails {...{ hoveredVertex }} />
          <SessionSettingsMenu {...{ mainAppLayoutState, setInitSketchAPIRes }} />
        </div>

        {/* QUERY SKETCH MAIN OVERLAYS */}
        {apiOffline && <ApiOfflineNotice {... { apiStatusResponse }} />}
        {!initSketchAPIRes && <InitializeQuerySessionInput {...{ mainAppLayoutState, setInitSketchAPIRes}} />}
        {showAboutSketchText && <AboutSketchTextDisplay {...{ initSketchAPIRes, mainAppLayoutState }} />}

        {/* p5 SKETCH CONTAINERS */}
        {showWikiverseSketch && <WikiverseSketchMemo {...{ initSketchAPIRes, mainAppLayoutState }} />}
        {showAboutSketch && <AboutSketchMemo {...{ initSketchAPIRes, mainAppLayoutState }} />}

        {/* QUERY SKETCH OVERLAY BOTTOM */}
        <div id='sketch-overlay-bot'>
          <SelectedVertexDetails {...{ selectedVertex }} />
          <GraphsetDetailsSummary {...{ mainAppLayoutState }} />
          <RelatedEdgesDetails {...{ mainAppLayoutState }} />
        </div>
      </div>

      {/* BACKGROUND SKETCH DIV */}
      <div id='background-sketch' ref={bgSketchRef}>
        <BackgroundSketchMemo {...{ containerDimensions }} />
      </div>
      <Footer {...{ mainAppLayoutState, setInitSketchAPIRes }} />
    </div >
  );
};