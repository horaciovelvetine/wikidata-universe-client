import './sketch-hud.css'
import { createRef, Dispatch, FC, SetStateAction, useEffect } from "react";
import { useDeviceCompatabilityCheck, WikiverseServiceResponse } from '../../../../app';
import { CurHoveredInfo, SketchSettings, CurSelectedInfo, RelatedEdgesInfo, MainLandingInput } from '..'
import { WikiverseSketch } from '../../../../types';
import { showHideSketchHUDRef } from '../../animations/show-hide-sketch-hud-ref';

interface SketchHUDContainerProps {
  sketchRef: WikiverseSketch | null;
  setInitSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

const ID = (sufx: string) => `sketch-hud-${sufx}`

export const SketchHUD: FC<SketchHUDContainerProps> = ({ setInitSketchData, sketchRef }) => {
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();

  const MainContainer = createRef<HTMLDivElement>();
  const HUDContainer = createRef<HTMLDivElement>();

  useEffect(() => { // Hide when screen size to small...
    showHideSketchHUDRef(MainContainer, meetsMinScreenSizeReq)
  }, [MainContainer, meetsMinScreenSizeReq])

  return (
    <div id={ID('container')} ref={MainContainer}>
      <div id={ID('top-container')} ref={HUDContainer}>
        {sketchRef && <CurHoveredInfo {...{ sketchRef }} />}
        {sketchRef && <SketchSettings {...{ sketchRef }} />}
      </div>

      {!sketchRef && <MainLandingInput {...{ setInitSketchData }} />}

      <div id={ID('bot-container')} ref={HUDContainer}>
        {sketchRef && <CurSelectedInfo {...{ sketchRef }} />}
        {sketchRef && <RelatedEdgesInfo {...{ sketchRef }} />}
      </div>
    </div>)
}