import './MainAppLayoutStyle.css'

import React, { useEffect, useState } from 'react';
import { Footer, VerticalSiteTitle } from '../components';
import { Dimensions, RequestResponse } from '../interfaces';
import { calcInitLayoutDimensions } from '../p5/functions';
import { QueryLayout } from './QueryLayout';


interface MainAppLayoutProps {
  demoInitQueryRes: RequestResponse
}

export const MainAppLayout: React.FC<MainAppLayoutProps> = ({ demoInitQueryRes }) => {
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>(calcInitLayoutDimensions())
  const [initQueryRes, setInitQueryRes] = useState(demoInitQueryRes);

  useEffect(() => {
    window.addEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
    return () => window.removeEventListener('resize', () => setContainerDimensions(calcInitLayoutDimensions()))
  }, [])

  return (
    <div id='wikiverse-main'>
      <VerticalSiteTitle />
      <div id='query-sketch' style={{ width: containerDimensions?.width, height: containerDimensions?.height }}>
        <QueryLayout {...{ initQueryRes, setInitQueryRes }} />
      </div>
      <Footer />
    </div>
  );
};