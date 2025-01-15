import './settings-open-indicator.css'
import { createRef, FC, useEffect, useState } from "react";
import { showHideSettingsOpenIndicator } from '..';
import { WikiverseSketch } from "../../../../types";
import { useDeviceCompatabilityCheck } from '../../../../app';

const ID = (sufx: string) => `settings-status-${sufx}`

interface SettingsOpenIndicatorProps {
  sketchRef: WikiverseSketch
}

export const SettingsOpenIndicator: FC<SettingsOpenIndicatorProps> = ({ sketchRef }) => {
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const [isShowing, setIsShowing] = useState(false);
  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    sketchRef.state.addshowSketchsettingsSubscriber(setIsShowing);
  })

  useEffect(() => {
    if (meetsMinScreenSizeReq) {
      showHideSettingsOpenIndicator(containerRef, isShowing)
    } else {
      showHideSettingsOpenIndicator(containerRef, meetsMinScreenSizeReq)
    }
  }, [isShowing, meetsMinScreenSizeReq, containerRef])

  return (
    <div id={ID('container')} ref={containerRef}>
      <div id={ID('title')}>
        <span>s</span>
        <span>e</span>
        <span>t</span>
        <span>t</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
        <span>s</span>
      </div>
    </div>
  )
}