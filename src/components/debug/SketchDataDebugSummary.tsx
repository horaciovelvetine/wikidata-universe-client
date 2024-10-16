import './SketchDataDebugSummary.css'
import React, { useEffect, useState } from 'react';

import { SketchData } from '../../interfaces';
import { SketchManager } from '../../models';

interface SketchDataDebugProps {
  wikiverseSketchData: SketchData | null,
  p5SketchRef: SketchManager | null;
}

export const SketchDataDebugSummary: React.FC<SketchDataDebugProps> = ({ wikiverseSketchData, p5SketchRef }) => {
  // const { width, height } = calcInitLayoutDimensions()
  const [curCamLookAt, setCurCamLookAt] = useState({ x: 0, y: 0, z: 0 });
  const [curCamPos, setCurCamPos] = useState({ x: 0, y: 0, z: 0 });
  const [vertCount, setVertCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [propCount, setPropCount] = useState(0);

  useEffect(() => {
    const updateCameraValues = () => {
      setCurCamLookAt({
        x: Math.round((p5SketchRef?.CAM().cam?.centerX ?? 0)),
        y: Math.round((p5SketchRef?.CAM().cam?.centerY ?? 0)),
        z: Math.round((p5SketchRef?.CAM().cam?.centerZ ?? 0))
      });

      setCurCamPos({
        y: Math.round((p5SketchRef?.CAM().cam?.eyeY ?? 0)),
        x: Math.round((p5SketchRef?.CAM().cam?.eyeX ?? 0)),
        z: Math.round((p5SketchRef?.CAM().cam?.eyeZ ?? 0))
      });

      setVertCount(wikiverseSketchData?.vertices?.length ?? 0)
      setEdgeCount(wikiverseSketchData?.edges?.length ?? 0)
      setPropCount(wikiverseSketchData?.properties?.length ?? 0)
    };

    updateCameraValues();

    const intervalId = setInterval(updateCameraValues, 100); // Update every 100ms

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [wikiverseSketchData, p5SketchRef]);

  return (
    <div id="sketch-data-summary-container">
      <h4>Debug:</h4>
      <p>Verts: {vertCount}</p>
      <p>Edges: {edgeCount}</p>
      <p>Props: {propCount}</p>
      <h5>Cam:</h5>
      <p>FOC:{`x: ${curCamLookAt.x}, y: ${curCamLookAt.y}, z: ${curCamLookAt.z}`}</p>
      <p>POS:{`x: ${curCamPos.x}, y: ${curCamPos.y}, z: ${curCamPos.z}`}</p>
    </div>
  );
};


