import React, { useEffect, useState } from 'react';
import './_SketchDataDebugSummaryStyle.css'

import { SketchData } from '../../interfaces';
import { calcInitLayoutDimensions } from '../../p5/functions';
import { SketchManager } from '../../p5/models/_SketchManager';

interface SketchDataDebugProps {
  sketchData: SketchData,
  aqlSketchRef: SketchManager | undefined;
}

export const SketchDataDebugSummary: React.FC<SketchDataDebugProps> = ({ sketchData, aqlSketchRef }) => {
  const { width, height } = calcInitLayoutDimensions()
  const [curCamLookAt, setCurCamLookAt] = useState({ x: 0, y: 0, z: 0 });
  const [curCamPos, setCurCamPos] = useState({ x: 0, y: 0, z: 0 });
  const [vertCount, setVertCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [propCount, setPropCount] = useState(0);

  useEffect(() => {
    const updateCameraValues = () => {
      setCurCamLookAt({
        x: Math.round((aqlSketchRef?.CAM().cam?.centerX ?? 0)),
        y: Math.round((aqlSketchRef?.CAM().cam?.centerY ?? 0)),
        z: Math.round((aqlSketchRef?.CAM().cam?.centerZ ?? 0))
      });

      setCurCamPos({
        y: Math.round((aqlSketchRef?.CAM().cam?.eyeY ?? 0)),
        x: Math.round((aqlSketchRef?.CAM().cam?.eyeX ?? 0)),
        z: Math.round((aqlSketchRef?.CAM().cam?.eyeZ ?? 0))
      });

      setVertCount(sketchData?.vertices?.length ?? 0)
      setEdgeCount(sketchData?.edges?.length ?? 0)
      setPropCount(sketchData?.properties?.length ?? 0)
    };

    updateCameraValues();

    const intervalId = setInterval(updateCameraValues, 100); // Update every 100ms

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [aqlSketchRef, sketchData]);

  return (
    <div id="sketch-data-summary-container">
      <h4>Debug:</h4>
      <p>Verts: {vertCount}</p>
      <p>Edges: {edgeCount}</p>
      <p>Props: {propCount}</p>
      <h5>Dim:</h5>
      <p>w x {width}</p>
      <p>h x {height}</p>
      <h5>Cam:</h5>
      <p>FOC: {`x: ${curCamLookAt.x}, y: ${curCamLookAt.y}, z: ${curCamLookAt.z}`}</p>
      <p>POS: {`x: ${curCamPos.x}, y: ${curCamPos.y}, z: ${curCamPos.z}`}</p>
    </div>
  );
};


