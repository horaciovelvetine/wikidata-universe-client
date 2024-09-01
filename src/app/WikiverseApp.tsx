import './WikiverseAppStyle.css';
import React, { useEffect, useState, memo } from 'react';
import { ApiStatus, SketchData, } from '../interfaces';
import { VerticalSiteTitle, Footer, VerTextDetails, ActiveQueryControls, RelatedEdgesDetails, HoveredVertexDetails } from '../components';

import { WikiverseSketch } from '../p5/WikiverseSketch';
import { calcInitLayoutDimensions } from '../p5/functions';
import { LookAtChange, Point3D, Vertex } from '../p5/models';

interface WikiverseAppProps {
  apiStatusRes: ApiStatus;
}

const MemoizedSketch = memo(WikiverseSketch, (prevProps, nextProps) => {
  return prevProps.curQuery == nextProps.curQuery;
})

export const WikiverseApp: React.FC<WikiverseAppProps> = () => {
  const [dimensions, setDimensions] = useState(calcInitLayoutDimensions());
  const [selectedVertex, setSelectedVertex] = useState<Vertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<Vertex | null>(null);


  const [curQuery, setCurQuery] = useState<string>('');
  const [sketchData, setSketchData] = useState<SketchData>({} as SketchData);
  const [lookAtRef, setLookAtRef] = useState<LookAtChange>();

  useEffect(() => {
    window.addEventListener('resize', () => setDimensions(calcInitLayoutDimensions()));
    return () => window.removeEventListener('resize', () => setDimensions(calcInitLayoutDimensions()));
  }, [])

  const focusVertexHandler = (focusVert: Vertex) => {
    const { x, y, z } = { ...focusVert.coords }
    lookAtRef?.setTarget(new Point3D(x, y, z))
  }

  return (
    <div id='wikiverse-container'>
      <VerticalSiteTitle />
      <div id='sketch-container' style={{ width: dimensions.width, height: dimensions.height }}>

        {/** TOP UI DETAILS */}
        <div id='sketch-overlay-top'>
          <HoveredVertexDetails {...{ hoveredVertex }} />
        </div>

        {/* SKETCH START */}
        <MemoizedSketch {...{ curQuery, sketchData, setSelectedVertex, setSketchData, setLookAtRef, setHoveredVertex }} />

        {/* BOTTOM UI DETAILS */}
        <div id='sketch-overlay-bot'>
          <RelatedEdgesDetails {...{ selectedVertex, sketchData, focusVertexHandler }} />
          <ActiveQueryControls {...{ curQuery, setCurQuery, setSketchData }} />
          <VerTextDetails {...{ selectedVertex }} />
        </div>

      </div>
      <Footer />
    </div>
  );
};
