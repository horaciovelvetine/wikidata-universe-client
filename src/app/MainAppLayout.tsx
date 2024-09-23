import './MainAppLayoutStyle.css'

import React, { createRef, useEffect, useState } from 'react';
import { Footer, VerticalSiteTitle } from '../components';
import { Dimensions, RequestResponse } from '../interfaces';
import { calcInitLayoutDimensions } from '../p5/functions';
import { QueryLayout } from './QueryLayout';
import { MainQuerySessionInput } from '../components/_MainQuerySessionInput';
import { StandbySketch } from '../p5/StandbySketch';
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


  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>
        <MainQuerySessionInput {...{ setQuerySessionData, setActiveQuerySession }} />
        {activeQuerySession ? <QueryLayout {... { querySessionData, setQuerySessionData }} /> : <></>}
      </div>
      <div id='standby-sketch' ref={stanbySktchRef}>
        <StandbySketch dimensions={containerDimensions} />
      </div>
      <Footer />
    </div>
  );
};