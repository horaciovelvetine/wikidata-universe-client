import React, { useState } from 'react';
import { IVertex, IProperty, IEdge, IFetchQueue, IWikidataUniverseSession, LayoutsProps } from '../interfaces';
import { QuerySketch, StandbySketch, MainQueryInput, Footer, ActiveQueryControls } from '../components';


export const MainAppLayout: React.FC<LayoutsProps> = ({ dimensions, apiStatus }: LayoutsProps) => {
  // DATA
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [vertices, setVertices] = useState<IVertex[] | undefined>(undefined);
  const [edges, setEdges] = useState<IEdge[] | undefined>(undefined);
  const [properties, setProperties] = useState<IProperty[] | undefined>(undefined);
  const [queue, setFetchQueue] = useState<IFetchQueue | undefined>(undefined);

  const session = (): IWikidataUniverseSession => {
    return { query, dimensions, apiStatus, vertices, edges, properties, queue }
  }

  const displaySketch = () => {
    return query == undefined ? <StandbySketch dimensions={dimensions} /> : <QuerySketch session={session()} />
  }
  const displayActiveQueryControl = () => {
    return query != undefined ? <ActiveQueryControls currentQuery={query} /> : <></>;
  }

  const handleFetchSuccess = async (queryVal: string, initResponseData: IWikidataUniverseSession) => {
    const { vertices, edges, properties, queue } = initResponseData;
    setVertices(vertices);
    setEdges(edges);
    setProperties(properties);
    setFetchQueue(queue)
    setQuery(queryVal);
  };

  return (
    <>
      <MainQueryInput handleFetchSuccess={handleFetchSuccess} />
      <div id='sketch-layout-container'>
        {displaySketch()}
        {displayActiveQueryControl()}
      </div>
      <Footer apiStatus={apiStatus} />
    </>
  );
};