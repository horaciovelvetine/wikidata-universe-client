import React, { memo, useEffect, useState } from 'react';
import { getInitSessionRequest } from '../api';
import { IApiStatus, IVertex, IProperty, IEdge, IDimensions, IFetchQueue, IWikidataUniverseSession } from '../interfaces';
import { P5SketchMain, MainQueryInput, Footer } from '../components';
import { calculateDrawingDimensions } from '../functions';
import { useDebounce } from '../hooks';
import { LayoutsProps } from '../interfaces/_LayoutsProps';

const MemoizedSketch = memo(P5SketchMain);

export const MainAppLayout: React.FC<LayoutsProps> = ({ apiStatus }: LayoutsProps) => {
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
      <MainQueryInput handleQuerySubmit={handleQuerySubmit} />
      <div id='sketch-layout-container'>
        <MemoizedSketch session={session()} />
      </div>
      <Footer apiStatus={apiStatus} />
    </>
  );
};