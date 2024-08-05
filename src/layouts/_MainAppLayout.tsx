import React, { useState } from 'react';
import { getInitSessionRequest } from '../api';
import { IVertex, IProperty, IEdge, IFetchQueue, IWikidataUniverseSession } from '../interfaces';
import { QuerySketch, StandbySketch, MainQueryInput, Footer } from '../components';
import { LayoutsProps } from '../interfaces/_LayoutsProps';

export const MainAppLayout: React.FC<LayoutsProps> = ({ dimensions, apiStatus }: LayoutsProps) => {
  // DATA
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [vertices, setVertices] = useState<IVertex[] | undefined>(undefined);
  const [edges, setEdges] = useState<IEdge[] | undefined>(undefined);
  const [properties, setProperties] = useState<IProperty[] | undefined>(undefined);
  const [fetchQueue, setFetchQueue] = useState<IFetchQueue | undefined>(undefined);

  const session = (): IWikidataUniverseSession => {
    return { query, dimensions, apiStatus, vertices, edges, properties, fetchQueue }
  }

  const displaySketch = () => {
    return query == undefined ? <StandbySketch dimensions={dimensions} /> : <QuerySketch session={session()} />
  }

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
        {displaySketch()}
      </div>
      <Footer apiStatus={apiStatus} />
    </>
  );
};