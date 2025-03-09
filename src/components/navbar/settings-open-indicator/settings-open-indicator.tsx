import "./settings-open-indicator.css";
import { useEffect, useState } from "react";

import { SketchRefProps } from "../../../types";
import { useDeviceCompatabilityCheck } from "../../../providers";
import { useComponentID } from "../../../hooks";

/**
 * Settings title text displayed whenever the settings menu is displayed on screen. Text translates on screen when shown and is otherwise visually hidden behind the main-display
 *
 * @param {P5Sketch} props.sketchRef - the currently active sketch instance
 */
export const SettingsOpenIndicator = ({ sketchRef }: SketchRefProps) => {
  const { ID } = useComponentID("settings-status");
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // subscribe to the settings open P5Sketch state
    sketchRef.state.addshowSketchsettingsSubscriber(setIsShowing);
  });

  return (
    <div
      id={ID("container")}
      className={meetsMinScreenSizeReq && isShowing ? "settings-open" : ""}
    >
      <div id={ID("title")}>
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
  );
};
