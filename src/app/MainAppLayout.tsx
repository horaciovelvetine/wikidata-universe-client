import './MainAppLayout.css'
import { MainAppLayoutState } from './MainAppLayoutState';

import React, { createRef, useEffect, useState, memo } from 'react';

import { Footer, VerticalSiteTitle, ApiOfflineNotice, SessionSettingsMenu, LoadingBar, HoveredVertexDetails, InitializeQuerySessionInput, GraphsetDetailsSummary, SelectedVertexDetails, toggleElementOpacity, BackgroundSketch, WikiverseSketch, RelatedEdgesDetails, calcSafeSketchWindowSize, AboutSketch } from '../components';
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

  // MAIN (REACT) APP LAYOUT STATE
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const [showAboutSketch, setShowAboutSketch] = useState(false);
  const [showWikiverseSketch, setShowWikiverseSketch] = useState(false);

  const mainAppLayoutState: MainAppLayoutState = {
    apiOnline, apiOffline,
    isLoading, setIsLoading,
    showSettings, setShowSettings,
    showDebugDetails, setShowDebugDetails,
    showAboutSketch, setShowAboutSketch
  }

  // WIKIVERSE SKETCH STATE
  const [initSketchAPIRes, setInitSketchAPIRes] = useState<RequestResponse | null>(null);
  const [p5SketchRef, setP5SketchRef] = useState<SketchManager | null>(null);
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);

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
  }, [initSketchAPIRes]);

  useEffect(() => {
    if (showAboutSketch) { }
  }, [showAboutSketch])

  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <LoadingBar isLoading={isLoading} />
      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>

        <div id='sketch-overlay-top'>
          <HoveredVertexDetails {...{ hoveredVertex }} />
          <SessionSettingsMenu {...{ p5SketchRef, mainAppLayoutState }} />
        </div>

        {apiOffline && <ApiOfflineNotice {... { apiStatusResponse }} />}
        {!initSketchAPIRes && <InitializeQuerySessionInput {...{ mainAppLayoutState, setInitSketchAPIRes, setShowWikiverseSketch }} />}

        {showWikiverseSketch && <WikiverseSketchMemo {...{ initSketchAPIRes, setSelectedVertex, setHoveredVertex, mainAppLayoutState, setP5SketchRef }} />}
        {showAboutSketch && <AboutSketchMemo {...{ mainAppLayoutState, setSelectedVertex, setHoveredVertex, setP5SketchRef }} />}

        <div id='sketch-overlay-bot'>
          <SelectedVertexDetails {...{ selectedVertex }} />
          <GraphsetDetailsSummary {...{ sketchRef: p5SketchRef, mainAppLayoutState }} />
          <RelatedEdgesDetails {...{ sketchRef: p5SketchRef, selectedVertex }} />
        </div>

      </div>
      <div id='background-sketch' ref={bgSketchRef}>
        <BackgroundSketchMemo {...{ containerDimensions }} />
      </div>
      <Footer {...{ setShowAboutSketch, setInitSketchAPIRes }} />
    </div >
  );
};