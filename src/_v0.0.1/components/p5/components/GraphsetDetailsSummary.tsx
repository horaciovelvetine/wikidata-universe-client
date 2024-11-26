import './GraphsetDetailsSummary.css'
import React, { createRef, useEffect, useState } from 'react';
import { MainAppLayoutState } from '../../../app/MainAppLayoutState';

interface GraphsetDetailsSummaryProps {
  mainAppLayoutState: MainAppLayoutState;
}

export const GraphsetDetailsSummary: React.FC<GraphsetDetailsSummaryProps> = ({ mainAppLayoutState }) => {
  const { showDebugDetails, p5SketchRef } = mainAppLayoutState;
  const [curCamLookAt, setCurCamLookAt] = useState({ x: 0, y: 0, z: 0 });
  const [curCamPos, setCurCamPos] = useState({ x: 0, y: 0, z: 0 });
  const [vertCount, setVertCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  const debugRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const updateCameraValues = () => {
      setCurCamLookAt({
        x: Math.round((p5SketchRef?.CAM().getP5Cam()?.centerX ?? 0)),
        y: Math.round((p5SketchRef?.CAM().getP5Cam()?.centerY ?? 0)),
        z: Math.round((p5SketchRef?.CAM().getP5Cam()?.centerZ ?? 0))
      });

      setCurCamPos({
        y: Math.round((p5SketchRef?.CAM().getP5Cam()?.eyeY ?? 0)),
        x: Math.round((p5SketchRef?.CAM().getP5Cam()?.eyeX ?? 0)),
        z: Math.round((p5SketchRef?.CAM().getP5Cam()?.eyeZ ?? 0))
      });

      setVertCount(p5SketchRef?.GRAPH()?.vertices?.length ?? 0)
      setEdgeCount(p5SketchRef?.GRAPH()?.edges?.length ?? 0)
    };

    updateCameraValues();

    const intervalId = setInterval(updateCameraValues, 100); // Update every 100ms

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [p5SketchRef, p5SketchRef?.GRAPH()]);

  useEffect(() => {
    if (!debugRef.current) return;
    if (showDebugDetails) {
      debugRef.current.style.transform = 'translateX(0)';
    } else {
      debugRef.current.style.transform = 'translateX(100%)';
    }

  }, [showDebugDetails])

  return (
    <div id="sketch-data-summary-container" ref={debugRef}>
      <div id='sketch-data-summary-entities'>
        <p>Topics: {vertCount}</p>
        <p>Statements: {edgeCount}</p>
        <p>Camera Focus {`(${curCamLookAt.x}, ${curCamLookAt.y}, ${curCamLookAt.z})`}</p>
        <p>Camera Position {`(${curCamPos.x}, ${curCamPos.y}, ${curCamPos.z})`}</p>
      </div>
    </div>
  );
};


