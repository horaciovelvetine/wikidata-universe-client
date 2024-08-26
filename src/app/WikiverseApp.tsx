import './WikiverseAppStyle.css';
import React, { useEffect, useState, memo } from 'react';
import { ApiStatus, SketchData, } from '../interfaces';
import { VerticalSiteTitle, Footer, VerTextDetails, ActiveQueryControls, RelatedEdgesDetails } from '../components';

import { WikiverseSketch } from '../p5/WikiverseSketch';
import { calcInitLayoutDimensions } from '../p5/functions';
import { Vertex } from '../p5/models';
import { Camera } from 'p5';



interface WikiverseAppProps {
  apiStatusRes: ApiStatus;
}

const MemoizedSketch = memo(WikiverseSketch, (prevProps, nextProps) => {
  return prevProps.query == nextProps.query
})

export const WikiverseApp: React.FC<WikiverseAppProps> = () => {
  const [dimensions, setDimensions] = useState(calcInitLayoutDimensions());
  const [query, setQuery] = useState<string>("Charles");
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [sketchData, setSketchData] = useState<SketchData | null>(null);
  const [camRef, setCamRef] = useState<Camera>();

  useEffect(() => {
    window.addEventListener('resize', () => setDimensions(calcInitLayoutDimensions()));
    return () => window.removeEventListener('resize', () => setDimensions(calcInitLayoutDimensions()));
  }, [])

  return (
    <div id='wikiverse-container'>
      <VerticalSiteTitle />
      <div id='sketch-container' style={{ width: dimensions.width, height: dimensions.height }}>
        <MemoizedSketch {...{ query, setSelectedVertex, setSketchData, setCamRef }} />
        <div id='sketch-overlay-bot'>
          <RelatedEdgesDetails {...{ selectedVertex, data: sketchData }} />
          <ActiveQueryControls curQuery={query} />
          <VerTextDetails vertex={selectedVertex} />
        </div>
      </div>
      <Footer />
    </div>
  );
};
