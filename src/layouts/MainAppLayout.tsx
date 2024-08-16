import React, { useState } from 'react';
import { ISessionData, LayoutsProps } from '../interfaces';
import { QuerySketch, StandbySketch, MainQueryInput, Footer, ActiveQueryControls } from '../components';

export const MainAppLayout: React.FC<LayoutsProps> = ({ dimensions, apiStatus }: LayoutsProps) => {
  const [sessionData, setSessionData] = useState<ISessionData | undefined>()

  const displaySketch = () => {
    return sessionData?.query == undefined ?
      <StandbySketch dimensions={dimensions} /> :
      (<>
        <QuerySketch session={sessionData} />
        <ActiveQueryControls currentQuery={sessionData?.query} />
      </>);
  }

  const handleFetchSuccess = async (queryVal: string, initResponseData: ISessionData) => {
    // next should send out that next query - in tandem with displaying 
    console.log(initResponseData);
  };

  return (
    <>
      <MainQueryInput handleFetchSuccess={handleFetchSuccess} />
      <div id='sketch-layout-container'>
        {displaySketch()}
      </div>
      <Footer apiStatus={apiStatus} />
    </>
  );
};