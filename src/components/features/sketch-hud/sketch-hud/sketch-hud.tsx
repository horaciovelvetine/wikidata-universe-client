import "./sketch-hud.css";
import { createRef, Dispatch, SetStateAction, useEffect } from "react";

import { P5Sketch } from "../../../../types";
import {
  useDeviceCompatabilityCheck,
  WikiverseServiceResponse,
} from "../../../../contexts";
import { showHideSketchHUDRef } from "../../animations/show-hide-sketch-hud-ref";
import {
  CurHoveredInfo,
  SketchSettings,
  CurSelectedInfo,
  RelatedEdgesInfo,
  MainLandingInput,
  TutorialMessageDisplay,
} from "..";

interface SketchHUDContainerProps {
  sketchRef: P5Sketch | null;
  setInitSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
  isTutorialSketch: boolean;
  setIsTutorialSketch: Dispatch<SetStateAction<boolean>>;
}

const ID = (sufx: string) => `sketch-hud-${sufx}`;

export const SketchHUD = ({
  setInitSketchData,
  sketchRef,
  isTutorialSketch,
  setIsTutorialSketch,
}: SketchHUDContainerProps) => {
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();

  const MainContainer = createRef<HTMLDivElement>();
  const HUDContainer = createRef<HTMLDivElement>();

  useEffect(() => {
    // Hide when screen size to small...
    showHideSketchHUDRef(MainContainer, meetsMinScreenSizeReq);
  }, [MainContainer, meetsMinScreenSizeReq]);

  return (
    <div id={ID("container")} ref={MainContainer}>
      <div id={ID("top-container")} ref={HUDContainer}>
        {sketchRef && <CurHoveredInfo {...{ sketchRef }} />}
        {sketchRef && <SketchSettings {...{ sketchRef }} />}
      </div>

      {sketchRef && isTutorialSketch && (
        <TutorialMessageDisplay {...{ sketchRef, setIsTutorialSketch }} />
      )}
      {!sketchRef && <MainLandingInput {...{ setInitSketchData }} />}

      <div id={ID("bot-container")} ref={HUDContainer}>
        {sketchRef && <CurSelectedInfo {...{ sketchRef }} />}
        {sketchRef && <RelatedEdgesInfo {...{ sketchRef }} />}
      </div>
    </div>
  );
};
