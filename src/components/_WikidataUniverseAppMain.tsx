import '../assets/styles/components/WikidataUniverseAppMain.css';

import React, { memo, useEffect } from 'react';
import { getInitSessionRequest } from '../api';
import { IApiStatusResponse, } from '../interfaces';
import { MainQueryInput, P5SketchMain, RelatedLinksInfobox } from '.';
import { useSessionState } from '../hooks/';


interface WikidataUniverseAppMainProps {
  apiStatus: IApiStatusResponse;
}

const MemoizedSketch = memo(P5SketchMain); // memoized sketch prevents re-rendering of sketch when unrelated state changes

export const WikidataUniverseAppMain: React.FC<WikidataUniverseAppMainProps> = ({ apiStatus }) => {
  const [sessionState, updateSessionState] = useSessionState({ apiStatus });

  const handleQuerySubmit = async (query: string) => {
    console.log("QueryResponse::", await getInitSessionRequest({ query, dimensions: sessionState.dimensions }));
  };

  return (
    <>
      <div id='app-layout-container'>
        {/* <MainQueryInput handleQuerySubmit={handleQuerySubmit} /> */}
        <div id='sketch-layout-container'>
          <MemoizedSketch />
        </div>
        <RelatedLinksInfobox apiStatus={apiStatus} />

      </div>
    </>
  );
};