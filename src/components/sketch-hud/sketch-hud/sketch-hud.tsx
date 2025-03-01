import "./sketch-hud.css";
import { Dispatch, SetStateAction } from "react";

import { P5Sketch } from "../../../types";
import { useDeviceCompatabilityCheck } from "../../../providers";

// Sub-Components
import { CurrentlyHoveredInfo } from "../currently-hovered-info/currently-hovered-info";
import { SketchSettings } from "../sketch-settings";
import { TutorialMessageDisplay } from "../tutorial-message-display/tutorial-message-display";
import { CurrentlySelectedInfo } from "../currently-selected-info/currently-selected-info";
import { RelatedEdgesInfo } from "../related-edges-info";
import { useComponentID } from "../../../hooks";

interface SketchHUDProps {
  sketchRef: P5Sketch | null;
  isTutorialSketch: boolean;
  setIsTutorialSketch: Dispatch<SetStateAction<boolean>>;
}

/**
 * Primary container for all of the  interactable features the client uses when there is an active @see P5Sketch
 * This component removes all of the HUD elements from the screen when @see meetsMinScreenSizeReq state changes.
 *
 * The HUD consists of two primary containers laid over the (z-index) top of the #main-display-container where the sketch is rendered.
 * Container 1 at the top includes the @see CurrentlyHoveredInfo & @see SketchSettings components. (left to right)
 * Container 2 at the bottom includes the @see CurrentlySelectedInfo & @see RelatedEdgesInfo comoonents.
 *
 * The @see TutorialMessageDisplay is a special case display used only when the client has initiated the tutorial
 *
 * @param {sketchRef} props.sketchRef - the @see SketchManager for the currently active sketch
 * @param {isTutorialSketch} props.isTutorialSketch - determines wether or not to display the @see TutorialMessageDisplay
 * @param {setIsTutorialSketch} props.setIsTutorialSketch - passed to the @see TutorialMessageDisplay for exiting the tutorial at will
 */
export const SketchHUD = ({
  sketchRef,
  isTutorialSketch,
  setIsTutorialSketch,
}: SketchHUDProps) => {
  const { ID } = useComponentID("sketch-hud");
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();

  return (
    <div
      id={ID("container")}
      className={sketchRef && meetsMinScreenSizeReq ? "on-screen" : ""}
    >
      <div id={ID("top-container")}>
        {sketchRef && <CurrentlyHoveredInfo {...{ sketchRef }} />}
        {sketchRef && <SketchSettings {...{ sketchRef }} />}
      </div>

      {sketchRef && isTutorialSketch && (
        <TutorialMessageDisplay {...{ sketchRef, setIsTutorialSketch }} />
      )}

      <div id={ID("bot-container")}>
        {sketchRef && <CurrentlySelectedInfo {...{ sketchRef }} />}
        {sketchRef && <RelatedEdgesInfo {...{ sketchRef }} />}
      </div>
    </div>
  );
};
