import "./on-screen-settings.css";
import { ChangeEvent, useEffect, useState } from "react";

import { SketchRefProps } from "../../../../types";
import { useComponentID } from "../../../../hooks";

/**
 * Contains settings UI which toggles the visibility of a few optional pieces of UI
 * around and inside the {@link P5Sketch} instance itself
 *
 * @component
 * @param {SketchRefProps} sketchRef - reference to the currently active sketch object
 *
 * @remark
 * This component uses elements/input to modify state effecting what the {@link P5Sketch} instance renders,
 * and also modifies other components visibility ref: {@link SketchDetailsSummary}. State is modified with
 * two differnt patterns related to it's use throughout the rest of the application...
 * @see SketchDetailsSummary for related UI...
 *
 * @hooks
 * - useState() - tracks boolean state for toggle-able informational details the client can use
 */
export const OnScreenSettings = ({ sketchRef }: SketchRefProps) => {
  const { ID } = useComponentID("on-screen-settings");
  const [showSketchSummaryRef, setShowSketchSummaryRef] = useState(
    sketchRef.state.showSketchDetailsSummary()
  );
  const [showBoundingBoxRef, setShowBoundingBoxRef] = useState(
    sketchRef.state.showBoundingBox()
  );
  const [showAxisOrientationRef, setShowAxisOrientationRef] = useState(
    sketchRef.state.showAxisOrientation()
  );

  useEffect(() => {
    sketchRef.state.addShowSketchDetailsSummarySubscriber(
      setShowSketchSummaryRef
    );
  });

  const handleShowHideSketchDetailsSummaryClick = () => {
    setShowSketchSummaryRef(prev => !prev);
    sketchRef.state.toggleShowSketchDetailsSummary();
  };

  const handleShowHideBoundingBox = () => {
    setShowBoundingBoxRef(prev => !prev);
    sketchRef.state.toggleShowBoundingBox();
  };

  const handleShowHideAxisOrientation = () => {
    setShowAxisOrientationRef(prev => !prev);
    sketchRef.state.toggleShowAxisOrientation();
  };

  return (
    <fieldset id={ID("container")}>
      <legend>
        <h4 id={ID("title")}>on-screen</h4>
      </legend>

      <ul id={ID("list")}>
        <ToggleSetting
          lbl="Graph Statistics"
          checkState={showSketchSummaryRef}
          toggleState={handleShowHideSketchDetailsSummaryClick}
          shortcut="[,]"
          ID={ID}
        />
        <ToggleSetting
          lbl="Bounding Box"
          checkState={showBoundingBoxRef}
          toggleState={handleShowHideBoundingBox}
          ID={ID}
        />
        <ToggleSetting
          lbl="Axis Orientation"
          checkState={showAxisOrientationRef}
          toggleState={handleShowHideAxisOrientation}
          ID={ID}
        />
      </ul>
    </fieldset>
  );
};

interface ToggleSettingProps {
  shortcut?: string;
  lbl: string;
  checkState: boolean | undefined;
  toggleState: (e: ChangeEvent<HTMLInputElement>) => void;
  ID: (sufx: string) => string;
}

/**
 * Sub - @component
 * @remark
 * Builds the container for each of the boolean input elements
 */
const ToggleSetting = ({
  shortcut,
  lbl,
  checkState,
  toggleState,
  ID,
}: ToggleSettingProps) => {
  return (
    <li className={ID("option-container")}>
      <label>
        {lbl} <span>{shortcut}</span>
      </label>
      <input
        checked={checkState}
        type="checkbox"
        onChange={e => toggleState(e)}
        name="toggle-show-hide"
      />
    </li>
  );
};
