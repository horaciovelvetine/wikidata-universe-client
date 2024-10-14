import './MainAppLayoutStyle.css'

import React, { createRef, useEffect, useState, memo } from 'react';
import { Dimensions, RequestResponse, SessionSettingsState } from '../interfaces';
import { ActiveQueryLayout } from './ActiveQueryLayout';
import { Footer, VerticalSiteTitle, ApiOfflineNotice, MainQuerySessionInput, SessionSettings, LoadingBar } from '../components';
import { showHideElement } from '../components/animations';

import { StandbySketch } from '../p5/StandbySketch';
import { calcInitLayoutDimensions } from '../p5/functions';
import { SketchManager } from '../p5/models/_SketchManager';

interface MainAppLayoutProps {
  apiStatusResponse: RequestResponse
}

const MemoizedStndbySketch = memo(StandbySketch, () => { return true });

export const MainAppLayout: React.FC<MainAppLayoutProps> = ({ apiStatusResponse }) => {
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>(calcInitLayoutDimensions())
  const [activeQuerySession, setActiveQuerySession] = useState(false);
  const [querySessionData, setQuerySessionData] = useState<RequestResponse>(apiStatusResponse);

  // Settings:
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const [showUnfetchedVertices, setShowUnfetchedVertices] = useState(false);
  const [showMedianAxis, setShowMedianAxis] = useState(false);
  const [showMedianBoundBox, setShowMedianBoundBox] = useState(false);
  const [showDimensionBoundBox, setShowDimensionBoundBox] = useState(false);
  const [malSketchRef, setMALSketchRef] = useState<SketchManager>();

  const sessionSettingsState: SessionSettingsState = {
    showDebugDetails, setShowDebugDetails,
    showUnfetchedVertices, setShowUnfetchedVertices,
    showMedianAxis, setShowMedianAxis,
    showMedianBoundBox, setShowMedianBoundBox,
    showDimensionBoundBox, setShowDimensionBoundBox,
    isLoading, setIsLoading
  };

  const stanbySktchRef = createRef<HTMLDivElement>()

  useEffect(() => {
    window.addEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
    return () => window.removeEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
  }, [])

  useEffect(() => {
    if (activeQuerySession) {
      showHideElement(stanbySktchRef.current!, false, "1.0");
    } else {
      showHideElement(stanbySktchRef.current!, true, "0.25");
    }
  }, [activeQuerySession])

  /**
   * Accesses the SketchManager which contains the P5.js sketches details and state, allowing sketch changes w/o additional re-render when React state changes
   */
  useEffect(() => {
    malSketchRef?.UI().toggleShowMedianAxis()
  }, [showMedianAxis])

  useEffect(() => {
    malSketchRef?.UI().toggleShowMedianBoundBox()
  }, [showMedianBoundBox])

  useEffect(() => {
    malSketchRef?.UI().toggleShowDimensionBoundBox()
  }, [showDimensionBoundBox])

  useEffect(() => {
    malSketchRef?.toggleShowUnfetchedVertices()
  }, [showUnfetchedVertices])

  const apiOnline = apiStatusResponse.status == 200;

  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <LoadingBar isLoading={isLoading} />
      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>
        {/* Settings Gear Icon */}
        <SessionSettings {...sessionSettingsState} />

        {/* Initialize a Query Session or API offline */}
        {apiOnline ?
          <MainQuerySessionInput {...{ setQuerySessionData, setActiveQuerySession, sessionSettingsState }} /> :
          <ApiOfflineNotice apiStatus={apiStatusResponse} />}

        {/* Active Query Session */}
        {activeQuerySession ?
          <ActiveQueryLayout {... { querySessionData, setQuerySessionData, sessionSettingsState, setMALSketchRef }} /> : <></>}
      </div>
      <div id='standby-sketch' ref={stanbySktchRef}>
        <MemoizedStndbySketch dimensions={containerDimensions} />
      </div>
      <Footer />
    </div>
  );
};