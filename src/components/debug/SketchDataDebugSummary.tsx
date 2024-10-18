import './SketchDataDebugSummary.css'
import React, { createRef, useEffect, useState } from 'react';

import { SessionSettingsState, SketchData } from '../../interfaces';
import { SketchManager } from '../../models';

interface SketchDataDebugProps {
  sessionSettingsState: SessionSettingsState;
  wikiverseSketchData: SketchData | null,
  p5SketchRef: SketchManager | null;
}

export const SketchDataDebugSummary: React.FC<SketchDataDebugProps> = ({ wikiverseSketchData, p5SketchRef, sessionSettingsState }) => {
  const { showDebugDetails } = sessionSettingsState;
  const [curCamLookAt, setCurCamLookAt] = useState({ x: 0, y: 0, z: 0 });
  const [curCamPos, setCurCamPos] = useState({ x: 0, y: 0, z: 0 });
  const [vertCount, setVertCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [propCount, setPropCount] = useState(0);

  const debugRef = createRef<HTMLDivElement>();

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

  useEffect(() => {
    if (!debugRef.current) return;
    const transition = 'transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)';
    debugRef.current.style.transition = transition;
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


