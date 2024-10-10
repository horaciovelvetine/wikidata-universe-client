import React, { useEffect, useState } from 'react';
import './_SketchDataDebugSummaryStyle.css'

import { SketchData } from '../../interfaces';
import { calcInitLayoutDimensions } from '../../p5/functions';
import { CameraManager } from '../../p5/models';

interface SketchDataDebugProps {
  sketchData: SketchData,
  cameraRef: CameraManager | undefined;
}

const SketchDataDebugSummary: React.FC<SketchDataDebugProps> = ({ sketchData, cameraRef }) => {
  const { width, height } = calcInitLayoutDimensions()
  const [curCamLookAt, setCurCamLookAt] = useState({ x: 0, y: 0, z: 0 });
  const [curCamPos, setCurCamPos] = useState({ x: 0, y: 0, z: 0 });
  const [vertCount, setVertCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [propCount, setPropCount] = useState(0);

  useEffect(() => {
    const updateCameraValues = () => {
      setCurCamLookAt({
        x: Math.round((cameraRef?.cam?.centerX ?? 0)),
        y: Math.round((cameraRef?.cam?.centerY ?? 0)),
        z: Math.round((cameraRef?.cam?.centerZ ?? 0))
      });

      setCurCamPos({
        x: Math.round((cameraRef?.cam?.eyeX ?? 0)),
        y: Math.round((cameraRef?.cam?.eyeY ?? 0)),
        z: Math.round((cameraRef?.cam?.eyeZ ?? 0))
      });

      setVertCount(sketchData?.vertices?.length ?? 0)
      setEdgeCount(sketchData?.edges?.length ?? 0)
      setPropCount(sketchData?.properties?.length ?? 0)
    };

    updateCameraValues();

    const intervalId = setInterval(updateCameraValues, 100); // Update every 100ms

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [cameraRef, sketchData]);

  return (
    <div id="sketch-data-summary-container">
      <p>Verts: {vertCount}</p>
      <p>Edges: {edgeCount}</p>
      <p>Props: {propCount}</p>
      <p>Dim:</p>
      <p>w x {width}</p>
      <p>h x {height}</p>
      <p>Cam:</p>
      <p>FOC: {`x: ${curCamLookAt.x}, y: ${curCamLookAt.y}, z: ${curCamLookAt.z}`}</p>
      <p>POS: {`x: ${curCamPos.x}, y: ${curCamPos.y}, z: ${curCamPos.z}`}</p>
    </div>
  );
};

export default SketchDataDebugSummary;
