import React, { useState } from 'react';
import { IVertex, IProperty, IEdge, IFetchQueue, ISessionData, LayoutsProps } from '../interfaces';
import { QuerySketch, StandbySketch, MainQueryInput, Footer, ActiveQueryControls } from '../components';


export const StuckSketchLayout: React.FC<LayoutsProps> = ({ dimensions, apiStatus }: LayoutsProps) => {
  // DATA
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [vertices, setVertices] = useState<IVertex[] | undefined>(undefined);
  const [edges, setEdges] = useState<IEdge[] | undefined>(undefined);
  const [properties, setProperties] = useState<IProperty[] | undefined>(undefined);
  const [queue, setFetchQueue] = useState<IFetchQueue | undefined>(undefined);

  const session = (): ISessionData => {
    return { query, dimensions, apiStatus, vertices, edges, properties, queue }
  }

  return (
    <>
      <div id='sketch-layout-container'>
        <QuerySketch session={session()} />
        <ActiveQueryControls currentQuery='testing' />
      </div>
      <Footer apiStatus={apiStatus} />
    </>
  );
};