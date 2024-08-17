import React, { useState } from 'react';
import { ISessionData, LayoutsProps } from '../interfaces';
import { QuerySketch, StandbySketch, MainQueryInput, Footer, ActiveQueryControls } from '../components';
import { Vertex } from '../components/_p5';

export const MainAppLayout: React.FC<LayoutsProps> = ({ dimensions, apiStatus }: LayoutsProps) => {
  const [sessionData, setSessionData] = useState<ISessionData | undefined>()

  const handleClickedVert = (vert: Vertex) => {
    console.log(vert.label);
  }

  const displaySketch = () => {
    return sessionData?.query == undefined ?
      <StandbySketch dimensions={dimensions} /> :
      <>
        <QuerySketch session={sessionData} handleClickedVert={handleClickedVert} />
        <ActiveQueryControls currentQuery={sessionData?.query} />
      </>;
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