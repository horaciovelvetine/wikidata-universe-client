import './MainAppLayoutStyle.css'
import OfflineRequestResponseBody from '../assets/data/client_request_1729218330942.json';

import React, { Dispatch, SetStateAction, createRef, useEffect, useState, memo } from 'react';
import { Footer, VerticalSiteTitle, ApiOfflineNotice, SessionSettingsMenu, LoadingBar, HoveredVertexDetails, InitializeQuerySessionInput, GraphsetDetailsSummary, SelectedVertexDetails, toggleElementOpacity, BackgroundSketch, WikiverseSketch, RelatedEdgesDetails, calcSafeSketchWindowSize } from '../components';
import { Dimensions, Graphset, Point3D, SketchManager, Vertex } from '../models';
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
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>(calcSafeSketchWindowSize())
  const [initialQueryResponse, setInitialQueryResponse] = useState<RequestResponse | null>(null);

  // State-Settings:
  const [p5SketchRef, setP5SketchRef] = useState<SketchManager | null>(null);
  const [apiOnline, setApiOnline] = useState(apiStatusResponse.status == 200)
  const [useOfflineData, setUseOfflineData] = useState(false); // DEV...
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuerySession, setActiveQuerySession] = useState(false);
  const [showAboutInfo, setShowAboutInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const [showMedianAxis, setShowMedianAxis] = useState(false);
  const [showMedianBoundBox, setShowMedianBoundBox] = useState(false);
  const [showDimensionBoundBox, setShowDimensionBoundBox] = useState(false);

  // Layout-Settings: (initializes w/ the layout)
  const [dataDensity, setDataDensity] = useState(0);
  const [attractionMult, setAttractionMult] = useState(0);
  const [repulsionMult, setRepulsionMult] = useState(0);

  const sessionSettingsState: MainAppLayoutSessionState = {
    showSettings, setShowSettings,
    activeQuerySession, setActiveQuerySession,
    showDebugDetails, setShowDebugDetails,
    showMedianAxis, setShowMedianAxis,
    showMedianBoundBox, setShowMedianBoundBox,
    showDimensionBoundBox, setShowDimensionBoundBox,
    isLoading, setIsLoading,
    useOfflineData, setUseOfflineData,
    apiOnline, setApiOnline,
    dataDensity, setDataDensity,
    attractionMult, setAttractionMult,
    repulsionMult, setRepulsionMult
  };

  // p5-Sketch Duplicative State
  const [graphset, setGraphset] = useState<Graphset | null>(null);
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);

  useEffect(() => {
    window.addEventListener('resize', () => setContainerDimensions(calcSafeSketchWindowSize()))
    return () => window.removeEventListener('resize', () => setContainerDimensions(calcSafeSketchWindowSize()))
  }, [])

  //? To allow modifying UI w/o spamming requests
  // useEffect(() => {
  //   if (useOfflineData) {
  //     setActiveQuerySession(true)
  //     setInitialQueryResponse({ status: 200, errMsg: '', data: OfflineRequestResponseBody });
  //     setApiOnline(true)
  //   }
  // }, [useOfflineData])

  useEffect(() => { // show the BG sketch when no initializeQueryResponse
    if (initialQueryResponse == null) {
      toggleElementOpacity(bgSketchRef.current!, true, "250ms");
    } else {
      toggleElementOpacity(bgSketchRef.current!, false, "1000ms");
    }
  }, [initialQueryResponse])

  useEffect(() => {
    p5SketchRef?.UI().toggleShowMedianAxis()
  }, [showMedianAxis])

  useEffect(() => {
    p5SketchRef?.UI().toggleShowMedianBoundBox()
  }, [showMedianBoundBox])

  useEffect(() => {
    p5SketchRef?.UI().toggleShowDimensionBoundBox()
  }, [showDimensionBoundBox])

  useEffect(() => {
    p5SketchRef?.updateDataDensity(dataDensity);
  }, [dataDensity])

  useEffect(() => {
    p5SketchRef?.updateRepulsionMult(repulsionMult);
  }, [repulsionMult])

  useEffect(() => {
    p5SketchRef?.updateAttractionMult(attractionMult);
  }, [attractionMult])

  const refreshLayoutHandler = () => {
    p5SketchRef?.refreshLayoutPositions()
  }

  const refocusCameraHandler = (coords: Point3D) => {
    p5SketchRef?.CAM().setTarget(coords);
  }

  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <LoadingBar isLoading={isLoading} />
      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>

        <div id='sketch-overlay-top'>
          <HoveredVertexDetails {...{ hoveredVertex }} />
          <SessionSettingsMenu {...{ sessionSettingsState, refreshLayoutHandler }} />
        </div>

        {!apiOnline && <ApiOfflineNotice {... { apiStatusResponse }} />}
        <InitializeQuerySessionInput {...{ sessionSettingsState, setInitialQueryResponse }} />

        {activeQuerySession && <WikiverseSketchMemo {...{ initialQueryResponse, setGraphset, setSelectedVertex, setHoveredVertex, setP5SketchRef, sessionSettingsState }} />}

        <div id='sketch-overlay-bot'>
          <SelectedVertexDetails {...{ selectedVertex }} />
          <GraphsetDetailsSummary {...{ graphset, p5SketchRef, sessionSettingsState }} />
          <RelatedEdgesDetails {...{ selectedVertex, graphset, refocusCameraHandler, }} />
        </div>
      </div>
      <div id='background-sketch' ref={bgSketchRef}>
        <BackgroundSketchMemo {...{ containerDimensions }} />
      </div>
      <Footer />
    </div>
  );
};

export interface MainAppLayoutSessionState {
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
  dataDensity: number;
  setDataDensity: Dispatch<SetStateAction<number>>;
  attractionMult: number;
  setAttractionMult: Dispatch<SetStateAction<number>>;
  repulsionMult: number;
  setRepulsionMult: Dispatch<SetStateAction<number>>;
}