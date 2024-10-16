import './MainAppLayoutStyle.css'

import React, { createRef, useEffect, useState, memo } from 'react';
import { Dimensions, RequestResponse, SessionSettingsState, SketchData } from '../interfaces';
import { Footer, VerticalSiteTitle, ApiOfflineNotice, SessionSettings, LoadingBar, HoveredVertexDetailsDisplay, SketchDataDebugSummary, InitializeQuerySessionInputMain, toggleElementOpacity } from '../components';

import { StandbySketch } from '../p5/BackgroundSketch';
import { WikiverseSketch } from '../p5/WikiverseSketch';
import { calcInitLayoutDimensions } from '../p5/functions';
import { Vertex, SketchManager } from '../p5/models';

interface MainAppLayoutProps {
  apiStatusResponse: RequestResponse
}

// Ignore-rerenders, handlesResize() => { }
const BackgroundSketchMemo = memo(StandbySketch, () => { return true; });

// locks re-render only on resetting of initResponse...
const WikiverseSketchMemo = memo(WikiverseSketch, (prevProps, nextProps) => {
  return prevProps.initialQueryResponse == nextProps.initialQueryResponse;
})

/**
 * 
 *  ====================================
 *  MAIN APP FUNCTIONAL COMPONENT BEGINS
 *  MAIN APP FUNCTIONAL COMPONENT BEGINS
 *  ====================================
 * 
 */
export const MainAppLayout: React.FC<MainAppLayoutProps> = ({ apiStatusResponse }) => {
  const apiOnline = apiStatusResponse.status == 200;
  const apiOffline = apiStatusResponse.status != 200;
  const bgSketchRef = createRef<HTMLDivElement>();
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>(calcInitLayoutDimensions())
  const [initialQueryResponse, setInitialQueryResponse] = useState<RequestResponse | null>(null);

  // State-Settings:
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuerySession, setActiveQuerySession] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const [showUnfetchedVertices, setShowUnfetchedVertices] = useState(false);
  const [showMedianAxis, setShowMedianAxis] = useState(false);
  const [showMedianBoundBox, setShowMedianBoundBox] = useState(false);
  const [showDimensionBoundBox, setShowDimensionBoundBox] = useState(false);
  const [p5SketchRef, setP5SketchRef] = useState<SketchManager | null>(null);

  const sessionSettingsState: SessionSettingsState = {
    showSettings, setShowSettings,
    activeQuerySession, setActiveQuerySession,
    showDebugDetails, setShowDebugDetails,
    showUnfetchedVertices, setShowUnfetchedVertices,
    showMedianAxis, setShowMedianAxis,
    showMedianBoundBox, setShowMedianBoundBox,
    showDimensionBoundBox, setShowDimensionBoundBox,
    isLoading, setIsLoading
  };

  // p5-Sketch Duplicative State
  const [wikiverseSketchData, setWikiverseSketchData] = useState<SketchData | null>(null);
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);

  //
  //** REACT EFFECTS */
  //
  useEffect(() => {
    window.addEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
    return () => window.removeEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
  }, [])

  useEffect(() => { // show the BG sketch when no initializeQueryResponse
    if (initialQueryResponse == null) {
      toggleElementOpacity(bgSketchRef.current!, true, "250ms");
    } else {
      toggleElementOpacity(bgSketchRef.current!, false, "1000ms");
    }
  }, [initialQueryResponse])

  //
  //** p5.JS STATE EFFECT UPDATES */
  //
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

  useEffect(() => {
    if (showSettings)
      p5SketchRef?.toggleShowUnfetchedVertices()
  }, [showUnfetchedVertices])

  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <LoadingBar isLoading={isLoading} />
      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>
        <div id='sketch-overlay-top'>
          <HoveredVertexDetailsDisplay {...{ hoveredVertex }} />
          <SessionSettings {...{ sessionSettingsState }} />
        </div>

        {apiOffline && <ApiOfflineNotice {... { apiStatusResponse }} />}
        {apiOnline && <InitializeQuerySessionInputMain {...{ sessionSettingsState, setInitialQueryResponse }} />}
        {activeQuerySession && <WikiverseSketchMemo {...{ initialQueryResponse, setWikiverseSketchData, setSelectedVertex, setHoveredVertex, setP5SketchRef, sessionSettingsState }} />}

        <div id='sketch-overlay-bot'>
          {/* <SketchDataDebugSummary {...{ wikiverseSketchData, p5SketchRef }} /> */}
        </div>
      </div>
      <div id='background-sketch' ref={bgSketchRef}>
        <BackgroundSketchMemo {...{ containerDimensions }} />
      </div>
      <Footer />
    </div>
  );
};