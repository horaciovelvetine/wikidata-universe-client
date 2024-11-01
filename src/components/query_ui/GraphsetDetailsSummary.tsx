import './GraphsetDetailsSummary.css'
import React, { createRef, useEffect, useState } from 'react';

import { SketchManager } from '../../models/p5_managers/SketchManager';
import { MainAppLayoutState } from '../../app/MainAppLayoutState';

interface GraphsetDetailsSummaryProps {
  mainAppLayoutState: MainAppLayoutState;
  sketchRef: SketchManager | null;
}

export const GraphsetDetailsSummary: React.FC<GraphsetDetailsSummaryProps> = ({ sketchRef, mainAppLayoutState }) => {
  const { showDebugDetails } = mainAppLayoutState;
  const [curCamLookAt, setCurCamLookAt] = useState({ x: 0, y: 0, z: 0 });
  const [curCamPos, setCurCamPos] = useState({ x: 0, y: 0, z: 0 });
  const [vertCount, setVertCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [propCount, setPropCount] = useState(0);

  const debugRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const updateCameraValues = () => {
      setCurCamLookAt({
        x: Math.round((sketchRef?.CAM().getP5Cam()?.centerX ?? 0)),
        y: Math.round((sketchRef?.CAM().getP5Cam()?.centerY ?? 0)),
        z: Math.round((sketchRef?.CAM().getP5Cam()?.centerZ ?? 0))
      });

      setCurCamPos({
        y: Math.round((sketchRef?.CAM().getP5Cam()?.eyeY ?? 0)),
        x: Math.round((sketchRef?.CAM().getP5Cam()?.eyeX ?? 0)),
        z: Math.round((sketchRef?.CAM().getP5Cam()?.eyeZ ?? 0))
      });

      setVertCount(sketchRef?.GRAPH()?.vertices?.length ?? 0)
      setEdgeCount(sketchRef?.GRAPH()?.edges?.length ?? 0)
      setPropCount(sketchRef?.GRAPH()?.properties?.length ?? 0)
    };

    updateCameraValues();

    const intervalId = setInterval(updateCameraValues, 100); // Update every 100ms

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [sketchRef, sketchRef?.GRAPH()]);

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
        <p>Verts {vertCount}</p>
        <p>Edges {edgeCount}</p>
        <p>Props {propCount}</p>
        <p>Cam-FOC{`(${curCamLookAt.x}, ${curCamLookAt.y}, ${curCamLookAt.z})`}</p>
        <p>Cam-POS{`(${curCamPos.x}, ${curCamPos.y}, ${curCamPos.z})`}</p>
      </div>
    </div>
  );
};


