import "./sketch-hud.css";
import { createRef, Dispatch, SetStateAction, useEffect } from "react";

import { P5Sketch } from "../../../../types";
import {
  useDeviceCompatabilityCheck,
  WikiverseServiceResponse,
} from "../../../../contexts";
// TODO - remove
import { showHideSketchHUDRef } from "../../animations/show-hide-sketch-hud-ref";

// Sub-Components
import { CurHoveredInfo } from "../cur-hovered-info/cur-hovered-info";
import { SketchSettings } from "../sketch-settings/";
import { TutorialMessageDisplay } from "../tutorial-message-display/tutorial-message-display";
import { MainLandingInput } from "../main-landing-input/main-landing-input";
import { CurSelectedInfo } from "../cur-selected-info/cur-selected-info";
import { RelatedEdgesInfo } from "../related-edges-info";

// Props
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
