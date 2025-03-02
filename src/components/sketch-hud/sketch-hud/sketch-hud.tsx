import "./sketch-hud.css";
import { Dispatch, SetStateAction } from "react";

import { P5Sketch } from "../../../types";
import { useDeviceCompatabilityCheck } from "../../../providers";

// Sub-Components
import { CurrentlyHoveredInfo } from "../currently-hovered-info/currently-hovered-info";
import { SketchSettings } from "../sketch-settings";
import { CurrentlySelectedInfo } from "../currently-selected-info/currently-selected-info";
import { RelatedEdgesInfo } from "../related-edges-info";
import { useComponentID } from "../../../hooks";

interface SketchHUDProps {
  sketchRef: P5Sketch | null;
  isTutorialSketch: boolean;
  setIsTutorialSketch: Dispatch<SetStateAction<boolean>>;
}

/**
 * Primary container for all of the  interactable features the client uses when there is an active {@link P5Sketch}
 * This component removes all of the HUD elements from the screen when meetsMinScreenSizeReq state changes.
 *
 * @component
 * @param {P5Sketch | null} props.sketchRef - the {@link P5Sketch} instance for the currently active sketch
 * @param {boolean} props.isTutorialSketch - determines wether the tutorial message display is visible
 * @param {setIsTutorialSketch} props.setIsTutorialSketch - allows tutorial to be exited via UI interaction in subcomponent
 *
 * @returns {JSX.Element} SketchHUD component.
 *
 * @remarks
 * The HUD consists of two primary containers laid over the (z-index) top of the #main-display-container where the sketch is rendered.
 * Container 1 At the top sub-components: (left to right)
 * - {@link CurrentlyHoveredInfo} - display details when the mouse hovers over a vertex
 * - {@link SketchSettings} - menu display and controls for changing sketch behaviors
 *
 * Container 2 at the bottom sub-components:
 * - {@link CurrentlySelectedInfo} - displays details when the user selects a vertex
 * - {@link RelatedEdgesInfo} - displays statements in a list based on the currently selected vertex
 *
 * @hook
 * - useDeviceCompatabilityCheck() - state used to determine the visibility of the HUD to prevent broken screens on small devices
 *
 */
export const SketchHUD = ({ sketchRef }: SketchHUDProps): JSX.Element => {
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

      {/* TODO: tutorial sketch HUD  */}

      <div id={ID("bot-container")}>
        {sketchRef && <CurrentlySelectedInfo {...{ sketchRef }} />}
        {sketchRef && <RelatedEdgesInfo {...{ sketchRef }} />}
      </div>
    </div>
  );
};
