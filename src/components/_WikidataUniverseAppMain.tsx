import '../assets/styles/components/WikidataUniverseAppMain.css';

import React, { memo, useEffect, createContext, useContext } from 'react';
import { getInitSessionRequest } from '../api';
import { IApiStatusResponse, IWikidataUniverseSession, } from '../interfaces';
import { MainQueryInput, P5SketchMain, RelatedLinksInfobox } from '.';
import { useSessionState } from '../hooks/';



interface WikidataUniverseAppMainProps {
  apiStatus: IApiStatusResponse;
}

const MemoizedSketch = memo(P5SketchMain); // memoized sketch prevents re-rendering of sketch when unrelated state changes
export const SessionContext = createContext<IWikidataUniverseSession | undefined>(undefined);

export const WikidataUniverseAppMain: React.FC<WikidataUniverseAppMainProps> = ({ apiStatus }) => {
  const [sessionState, updateSessionState] = useSessionState({ apiStatus });


  const handleQuerySubmit = async (query: string) => {
    console.log("QueryResponse::", await getInitSessionRequest({ query, dimensions: sessionState.dimensions }));
  };

  return (
    <SessionContext.Provider value={sessionState}>
      <MainQueryInput handleQuerySubmit={handleQuerySubmit} />
      <div id='sketch-layout-container'>
        <MemoizedSketch />
      </div>
      <RelatedLinksInfobox apiStatus={apiStatus} />
    </SessionContext.Provider>
  );
};