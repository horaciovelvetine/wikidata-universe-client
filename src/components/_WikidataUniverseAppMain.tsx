import '../assets/styles/components/WikidataUniverseAppMain.css';

import React, { memo, useEffect, useState } from 'react';
import { getInitSessionRequest } from '../api';
import { IApiStatusResponse, IVertex, IProperty, IEdge, IDimensions, IFetchQueue, IWikidataUniverseSession } from '../interfaces';
import { MainQueryInput, P5SketchMain, RelatedLinksInfobox } from '.';
import { calculateDrawingDimensions } from '../functions';
import { useDebounce } from '../hooks';

interface WikidataUniverseAppMainProps {
  apiStatus: IApiStatusResponse;
}

const MemoizedSketch = memo(P5SketchMain); // memoized sketch prevents re-rendering of sketch when unrelated state changes

export const WikidataUniverseAppMain: React.FC<WikidataUniverseAppMainProps> = ({ apiStatus }) => {
  const [dimensions, setDimensions] = useState<IDimensions>(calculateDrawingDimensions(window));
  // GRAPHSET
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [vertices, setVertices] = useState<IVertex[] | undefined>(undefined);
  const [edges, setEdges] = useState<IEdge[] | undefined>(undefined);
  const [properties, setProperties] = useState<IProperty[] | undefined>(undefined);
  const [fetchQueue, setFetchQueue] = useState<IFetchQueue | undefined>(undefined);

  const session = (): IWikidataUniverseSession => {
    return { query, dimensions, apiStatus, vertices, edges, properties, fetchQueue }
  }

  const handleResizeDebounces = useDebounce(() => {
    setDimensions(calculateDrawingDimensions(window));
  }, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResizeDebounces);

    return () => {
      window.removeEventListener('resize', handleResizeDebounces);
    };
  }, [handleResizeDebounces]);

  console.log(apiStatus);

  const handleQuerySubmit = async (queryVal: string) => {
    const { vertices, edges, properties, fetchQueue } = await getInitSessionRequest({ queryVal, dimensions });
    setQuery(queryVal);
    setVertices(vertices);
    setEdges(edges);
    setProperties(properties);
    setFetchQueue(fetchQueue)
    debugger;
  };

  return (
    <>
      {apiStatus.status != 500 ?
        <>
          <MainQueryInput handleQuerySubmit={handleQuerySubmit} />
          <div id='sketch-layout-container'>
            <MemoizedSketch session={session()} />
          </div>
          <RelatedLinksInfobox apiStatus={apiStatus} /></>
        :
        <p>here I am</p>
      }
    </>
  );
};