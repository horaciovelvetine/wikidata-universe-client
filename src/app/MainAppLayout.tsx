import './MainAppLayout.css'
import { MainAppLayoutState } from './MainAppLayoutState';

import React, { Dispatch, SetStateAction, createRef, useEffect, useState, memo } from 'react';

import { Footer, VerticalSiteTitle, ApiOfflineNotice, SessionSettingsMenu, LoadingBar, HoveredVertexDetails, InitializeQuerySessionInput, GraphsetDetailsSummary, SelectedVertexDetails, toggleElementOpacity, BackgroundSketch, WikiverseSketch, RelatedEdgesDetails, calcSafeSketchWindowSize } from '../components';
import { Dimensions, SketchManager, Vertex } from '../models';
import { RequestResponse } from '../api';

interface MainAppLayoutProps {
  apiStatusResponse: RequestResponse
}

// Ignore-rerenders, handlesResize() => { }
const BackgroundSketchMemo = memo(BackgroundSketch, () => { return true; });

// locks re-render only on resetting of initResponse...
const WikiverseSketchMemo = memo(WikiverseSketch, (prevProps, nextProps) => {
  return prevProps.initialQueryResponse == nextProps.initialQueryResponse;
})

export const MainAppLayout: React.FC<MainAppLayoutProps> = ({ apiStatusResponse }) => {
  const bgSketchRef = createRef<HTMLDivElement>();
  // MAIN APP LAYOUT STATE
  const apiOnline = apiStatusResponse.status == 200;
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>(calcSafeSketchWindowSize())
  // P5 DATA STATE
  const [initialQueryResponse, setInitialQueryResponse] = useState<RequestResponse | null>(null);
  const [wikiverseSketchRef, setWikiverseSketchRef] = useState<SketchManager | null>(null);
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);

  const mainAppLayoutState: MainAppLayoutState = {
    apiOnline,
    isLoading, setIsLoading,
    showSettings, setShowSettings,
    showDebugDetails, setShowDebugDetails,
  }

  useEffect(() => {
    window.addEventListener('resize', () => setContainerDimensions(calcSafeSketchWindowSize()))
    return () => window.removeEventListener('resize', () => setContainerDimensions(calcSafeSketchWindowSize()))
  }, [])

  useEffect(() => { // show the BG sketch when no initializeQueryResponse
    if (initialQueryResponse == null) {
      toggleElementOpacity(bgSketchRef.current!, true, "250ms");
    } else {
      toggleElementOpacity(bgSketchRef.current!, false, "1000ms");
    }
  }, [initialQueryResponse])


  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <LoadingBar isLoading={isLoading} />
      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>

        <div id='sketch-overlay-top'>
          <HoveredVertexDetails {...{ hoveredVertex }} />
          <SessionSettingsMenu {...{ wikiverseSketchRef, mainAppLayoutState }} />
        </div>

        {!apiOnline && <ApiOfflineNotice {... { apiStatusResponse }} />}
        <InitializeQuerySessionInput {...{ mainAppLayoutState, setInitialQueryResponse }} />

        {initialQueryResponse && <WikiverseSketchMemo {...{ initialQueryResponse, setSelectedVertex, setHoveredVertex, mainAppLayoutState, setWikiverseSketchRef }} />}

        <div id='sketch-overlay-bot'>
          <SelectedVertexDetails {...{ selectedVertex }} />
          <GraphsetDetailsSummary {...{ sketchRef: wikiverseSketchRef, mainAppLayoutState }} />
          <RelatedEdgesDetails {...{ sketchRef: wikiverseSketchRef, selectedVertex }} />
        </div>
      </div>
      <div id='background-sketch' ref={bgSketchRef}>
        <BackgroundSketchMemo {...{ containerDimensions }} />
      </div>
      <Footer />
    </div>
  );
};