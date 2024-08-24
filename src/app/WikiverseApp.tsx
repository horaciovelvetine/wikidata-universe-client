import './WikiverseAppStyle.css';
import React, { useEffect, useState } from 'react';
import { ApiStatus } from '../interfaces';
import { VerticalSiteTitle, Footer, VerTextDetails, ActiveQueryControls } from '../components';

import { WikiverseSketch } from '../p5/WikiverseSketch';

import { calcSafeDimensions } from '../p5/functions';


interface WikiverseAppProps {
  apiStatusRes: ApiStatus;
}

export const WikiverseApp: React.FC<WikiverseAppProps> = () => {
  const [dimensions, setDimensions] = useState(calcSafeDimensions());

  useEffect(() => {
    window.addEventListener('resize', () => setDimensions(calcSafeDimensions()));
    return () => window.removeEventListener('resize', () => setDimensions(calcSafeDimensions()));
  }, [])

  return (
    <div id='wikiverse-container'>
      <VerticalSiteTitle />
      <div id='sketch-container' style={{ width: dimensions.width, height: dimensions.height }}>
        <WikiverseSketch />
        <div id='sketch-overlay-bot'>
          <ActiveQueryControls curQuery={'test'} />
          <VerTextDetails vertex={null} />
        </div>
      </div>
      <Footer />
    </div>
  );
};
