import './MainAppLayoutStyle.css'

import React, { useEffect, useState } from 'react';
import { Footer, VerticalSiteTitle } from '../components';
import { Dimensions, RequestResponse } from '../interfaces';
import { calcInitLayoutDimensions } from '../p5/functions';
import { QueryLayout } from './QueryLayout';
import { MainQuerySessionInput } from '../components/_MainQuerySessionInput';
import { StandbySketch } from '../p5/StandbySketch';


interface MainAppLayoutProps {
  apiStatusResponse: RequestResponse
}

export const MainAppLayout: React.FC<MainAppLayoutProps> = ({ apiStatusResponse }) => {
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>(calcInitLayoutDimensions())
  const [activeQuerySession, setActiveQuerySession] = useState(false);
  const [querySessionData, setQuerySessionData] = useState<RequestResponse>(apiStatusResponse);

  useEffect(() => {
    window.addEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
    return () => window.removeEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
  }, [])


  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <div id='query-sketch' style={{ width: containerDimensions.width, height: containerDimensions.height }}>
        <MainQuerySessionInput />
        {activeQuerySession ? <QueryLayout {... { querySessionData, setQuerySessionData }} /> : <></>}
      </div>
      <div id='standby-sketch'>
        <StandbySketch dimensions={containerDimensions} />
      </div>
      <Footer />
    </div>
  );
};