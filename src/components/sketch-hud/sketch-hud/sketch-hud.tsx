import "./sketch-hud.css";
import { createRef, Dispatch, SetStateAction, useEffect } from "react";

// TODO - remove animation
import { showHideSketchHUDRef } from "../../animations/show-hide-sketch-hud-ref";
import { P5Sketch } from "../../../types";
import { useDeviceCompatabilityCheck } from "../../../providers";

// Sub-Components
import { CurrentlyHoveredInfo } from "../currently-hovered-info/currently-hovered-info";
import { SketchSettings } from "../sketch-settings";
import { TutorialMessageDisplay } from "../tutorial-message-display/tutorial-message-display";
import { CurrentlySelectedInfo } from "../currently-selected-info/currently-selected-info";
import { RelatedEdgesInfo } from "../related-edges-info";

// Props
interface SketchHUDProps {
  sketchRef: P5Sketch | null;
  isTutorialSketch: boolean;
  setIsTutorialSketch: Dispatch<SetStateAction<boolean>>;
}

const ID = (sufx: string) => `sketch-hud-${sufx}`;

/**
 * Contains all of the interactable features the client uses when there is a sketch on the main-display.
 *
 * @param {sketchRef} props.sketchRef - the @see SketchManager obj. for the currently active sketch
 * @param {isTutorialSketch} props.isTutorialSketch - determines wether or not to display the @see TutorialMessageDisplay @component
 * @param {setIsTutorialSketch} props.setIsTutorialSketch - passed to the @see TutorialMessageDisplay @component for exiting the tutorial at will
 */
export const SketchHUD = ({
  sketchRef,
  isTutorialSketch,
  setIsTutorialSketch,
}: SketchHUDProps) => {
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
        {sketchRef && <CurrentlyHoveredInfo {...{ sketchRef }} />}
        {sketchRef && <SketchSettings {...{ sketchRef }} />}
      </div>

      {sketchRef && isTutorialSketch && (
        <TutorialMessageDisplay {...{ sketchRef, setIsTutorialSketch }} />
      )}

      <div id={ID("bot-container")} ref={HUDContainer}>
        {sketchRef && <CurrentlySelectedInfo {...{ sketchRef }} />}
        {sketchRef && <RelatedEdgesInfo {...{ sketchRef }} />}
      </div>
    </div>
  );
};
