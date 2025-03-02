import "./sketch-settings.css";
import { useEffect, useState } from "react";
import { Settings } from "../../../../assets/icons";

import { P5Sketch, SketchRefProps } from "../../../../types";
import { useComponentID } from "../../../../hooks";
import { UnfocusedClickBoundaryProvider } from "../../../../providers";

// Sub-Components
import { OnScreenSettings } from "../on-screen-settings/on-screen-settings";
import { MouseSettings } from "../mouse-settings/mouse-settings";
import { BehaviorSettings } from "../behavior-settings/behavior-settings";
import { LayoutSettings } from "../layout-settings/layout-settings";

/**
 * Component contains a variety of settings sub-components which allow the user to interact with and
 * change settings and behaviors pertaining to the currently active {@link P5Sketch} instance.
 *
 * @component
 * @param {SketchRefProps} props - a reference to the current sketch instance
 *
 * @returns {JSX.Element} SketchSettings component.
 *
 * @remarks
 * Serves as a larger container for both the <img/> icon and #sketch-settings-menu-display <div/>.
 * The icon is always visible in the upper right hand corner of the {@link SketchHUD} (enclosing container),
 * while the #menu-display is added and removed from screen.
 *
 * Individual settings UI sub-components are:
 * - {@link BehaviorSettings} - modifies behaviors within the P5Sketch instance itself
 * - {@link LayoutSettings} - modify how Vertices are positioned inside the 'Wikiverse'
 * - {@link MouseSettings} - modify user mouse sensitivity
 * - {@link OnScreenSettings} - modify how or what is displaying inside the sketch
 *
 * @hook
 * - UnfocusClickToClose - provider wraps settings to allow clicks outside the display to close the menu
 * - useState - manage visibility state of the #sketch-settings-menu-display
 */
export const SketchSettings = ({ sketchRef }: SketchRefProps): JSX.Element => {
  const { ID } = useComponentID("sketch-settings");
  const [showSettingsMenu, setShowSettingsMenu] = useState(
    sketchRef.state.showSketchSettings()
  );

  useEffect(() => {
    // tell sketch how to let React know settings menu is open...
    sketchRef.state.addshowSketchsettingsSubscriber(setShowSettingsMenu);
  });

  const handleToggleMenuShowIconClick = (
    e: React.MouseEvent<HTMLImageElement>
  ) => {
    e.stopPropagation();
    sketchRef.state.toggleShowSketchSettings();
  };

  const handleUnfocusClick = () => {
    // if the menu is is currently visible, and unfocused click should close the settings menu
    if (showSettingsMenu) {
      sketchRef.state.toggleShowSketchSettings();
    }
  };

  return (
    <div id={ID("container")}>
      <UnfocusedClickBoundaryProvider
        unfocusedClickCallback={handleUnfocusClick}
      >
        <div id={ID("icon-container")}>
          <img
            id={ID("gear-icon")}
            src={Settings}
            onClick={e => handleToggleMenuShowIconClick(e)}
          />
        </div>

        <div
          id={ID("menu-display")}
          className={showSettingsMenu ? "on-screen" : "hidden"}
          onWheel={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
        >
          <div id={ID("menu-layout-container")}>
            <div id={ID("split-col-layout")}>
              <OnScreenSettings {...{ sketchRef }} />
              <MouseSettings {...{ sketchRef }} />
            </div>
            <BehaviorSettings {...{ sketchRef }} />

            <LayoutSettings {...{ sketchRef }} />
          </div>
        </div>
      </UnfocusedClickBoundaryProvider>
    </div>
  );
};
