import './MainAppLayoutStyle.css'

import React, { createRef, useEffect, useState } from 'react';
import { Dimensions, RequestResponse } from '../interfaces';
import { calcInitLayoutDimensions } from '../p5/functions';
import { ActiveQueryLayout } from './ActiveQueryLayout';
import { StandbySketch } from '../p5/StandbySketch';
import { Footer, VerticalSiteTitle, ApiOfflineNotice, MainQuerySessionInput } from '../components';
import { showHideElement } from '../components/animations';


interface MainAppLayoutProps {
  apiStatusResponse: RequestResponse
}

export const MainAppLayout: React.FC<MainAppLayoutProps> = ({ apiStatusResponse }) => {
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>(calcInitLayoutDimensions())
  const [activeQuerySession, setActiveQuerySession] = useState(false);
  const [querySessionData, setQuerySessionData] = useState<RequestResponse>(apiStatusResponse);

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

  const apiOnline = apiStatusResponse.status == 200;
  const apiOffline = apiStatusResponse.status != 200;

  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>
        {apiOnline ? <MainQuerySessionInput {...{ setQuerySessionData, setActiveQuerySession }} /> : <></>}
        {apiOffline ? <ApiOfflineNotice apiStatus={apiStatusResponse} /> : <></>}
        {activeQuerySession ? <ActiveQueryLayout {... { querySessionData, setQuerySessionData }} /> : <></>}
      </div>
      <div id='standby-sketch' ref={stanbySktchRef}>
        <StandbySketch dimensions={containerDimensions} />
      </div>
      <Footer />
    </div>
  );
};