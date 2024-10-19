import './MainAppLayoutStyle.css'

import React, { Dispatch, SetStateAction, createRef, useEffect, useState, memo } from 'react';
import { Footer, VerticalSiteTitle, ApiOfflineNotice, SessionSettingsMenu, LoadingBar, HoveredVertexDetails, InitializeQuerySessionInput, GraphsetDetailsSummary, SelectedVertexDetails, toggleElementOpacity, BackgroundSketch, WikiverseSketch, RelatedEdgesDetails } from '../components';

import OfflineRequestResponseBody from '../assets/data/client_request_1729218330942.json';
import { Dimensions, iGraphset, SketchManager, Vertex } from '../models';
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

const calcInitLayoutDimensions = () => {
  return { width: Math.round(window.innerWidth * 0.8), height: Math.round(window.innerHeight * 0.85) };
}

export const MainAppLayout: React.FC<MainAppLayoutProps> = ({ apiStatusResponse }) => {
  const bgSketchRef = createRef<HTMLDivElement>();
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>(calcInitLayoutDimensions())
  const [initialQueryResponse, setInitialQueryResponse] = useState<RequestResponse | null>(null);

  // State-Settings:
  const [apiOnline, setApiOnline] = useState(apiStatusResponse.status == 200)
  const [useOfflineData, setUseOfflineData] = useState(false); // DEV...
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuerySession, setActiveQuerySession] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const [showMedianAxis, setShowMedianAxis] = useState(false);
  const [showMedianBoundBox, setShowMedianBoundBox] = useState(false);
  const [showDimensionBoundBox, setShowDimensionBoundBox] = useState(false);
  const [p5SketchRef, setP5SketchRef] = useState<SketchManager | null>(null);

  const sessionSettingsState: SessionSettingsState = {
    showSettings, setShowSettings,
    activeQuerySession, setActiveQuerySession,
    showDebugDetails, setShowDebugDetails,
    showMedianAxis, setShowMedianAxis,
    showMedianBoundBox, setShowMedianBoundBox,
    showDimensionBoundBox, setShowDimensionBoundBox,
    isLoading, setIsLoading,
    useOfflineData, setUseOfflineData,
    apiOnline, setApiOnline
  };

  // p5-Sketch Duplicative State
  const [wikiverseGraphset, setWikiverseGraphset] = useState<iGraphset | null>(null);
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);

  //
  //** REACT EFFECTS */
  //
  useEffect(() => {
    window.addEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
    return () => window.removeEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
  }, [])

  //? To allow modifying UI w/o spamming requests
  useEffect(() => {
    if (useOfflineData) {
      setActiveQuerySession(true)
      setInitialQueryResponse({ status: 200, errMsg: '', data: OfflineRequestResponseBody });
      setApiOnline(true)
    }
  }, [useOfflineData])

  useEffect(() => { // show the BG sketch when no initializeQueryResponse
    if (initialQueryResponse == null) {
      toggleElementOpacity(bgSketchRef.current!, true, "250ms");
    } else {
      toggleElementOpacity(bgSketchRef.current!, false, "1000ms");
    }
  }, [initialQueryResponse])

  useEffect(() => {
    if (showSettings)
      p5SketchRef?.UI().toggleShowMedianAxis()
  }, [showMedianAxis])

  useEffect(() => {
    if (showSettings)
      p5SketchRef?.UI().toggleShowMedianBoundBox()
  }, [showMedianBoundBox])

  useEffect(() => {
    if (showSettings)
      p5SketchRef?.UI().toggleShowDimensionBoundBox()
  }, [showDimensionBoundBox])

  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <LoadingBar isLoading={isLoading} />
      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>

        <div id='sketch-overlay-top'>
          <HoveredVertexDetails {...{ sessionSettingsState, hoveredVertex }} />
          <SessionSettingsMenu {...{ sessionSettingsState }} />
        </div>

        {!apiOnline && <ApiOfflineNotice {... { apiStatusResponse }} />}
        <InitializeQuerySessionInput {...{ sessionSettingsState, setInitialQueryResponse }} />

        {activeQuerySession && <WikiverseSketchMemo {...{ initialQueryResponse, setWikiverseGraphset, setSelectedVertex, setHoveredVertex, setP5SketchRef, sessionSettingsState }} />}

        <div id='sketch-overlay-bot'>
          <SelectedVertexDetails {...{ selectedVertex, sessionSettingsState }} />
          <GraphsetDetailsSummary {...{ wikiverseGraphset, p5SketchRef, sessionSettingsState }} />
          <RelatedEdgesDetails {...{ sessionSettingsState, selectedVertex }} />
        </div>
      </div>
      <div id='background-sketch' ref={bgSketchRef}>
        <BackgroundSketchMemo {...{ containerDimensions }} />
      </div>
      <Footer />
    </div>
  );
};

export interface SessionSettingsState {
  showSettings: boolean;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
  activeQuerySession: boolean;
  setActiveQuerySession: Dispatch<SetStateAction<boolean>>;
  showDebugDetails: boolean;
  setShowDebugDetails: Dispatch<SetStateAction<boolean>>;
  showMedianAxis: boolean;
  setShowMedianAxis: Dispatch<SetStateAction<boolean>>;
  showMedianBoundBox: boolean;
  setShowMedianBoundBox: Dispatch<SetStateAction<boolean>>;
  showDimensionBoundBox: boolean;
  setShowDimensionBoundBox: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  useOfflineData: boolean;
  setUseOfflineData: Dispatch<SetStateAction<boolean>>;
  apiOnline: boolean;
  setApiOnline: Dispatch<SetStateAction<boolean>>;
}