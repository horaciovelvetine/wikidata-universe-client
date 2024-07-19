import React, { memo, useEffect } from 'react';
import { getInitSessionRequest } from '../api';
import { IApiStatusResponse, } from '../interfaces';
import { MainQueryInput, P5SketchMain, RelatedLinksInfobox } from '.';
import { useSessionState } from '../hooks/';
import { calculateDrawingDimensions } from '../functions';


interface WikidataUniverseAppMainProps {
  apiStatus: IApiStatusResponse;
  wikidataApiStatus: string;
}

const MemoizedSketch = memo(P5SketchMain); // memoized sketch prevents re-rendering of sketch when unrelated state changes

export const WikidataUniverseAppMain: React.FC<WikidataUniverseAppMainProps> = ({ apiStatus, wikidataApiStatus }) => {
  const [sessionState, updateSessionState] = useSessionState({ apiStatus, wikidataApiStatus });

  useEffect(() => {
    window.addEventListener('resize', () => {
      updateSessionState('dimensions', calculateDrawingDimensions(window));
    });

    console.log('Session State:', sessionState);

    return () => {
      window.removeEventListener('resize', () => {
        updateSessionState('dimensions', calculateDrawingDimensions(window));
      });
    };

  }, [sessionState]);

  const handleQuerySubmit = async (query: string, setQueryInput: React.Dispatch<React.SetStateAction<string>>) => {
    console.log(await getInitSessionRequest({ query, dimensions: sessionState.dimensions }));
    updateSessionState('originQuery', query);
    setQueryInput('disabled');
  };

  return (
    <>
      <div id='app-layout-container'>
        <MainQueryInput handleQuerySubmit={handleQuerySubmit} />
        <div id='sketch-layout-container'>
          <MemoizedSketch />
        </div>
        <RelatedLinksInfobox apiStatus={apiStatus} />
      </div>
    </>
  );
};