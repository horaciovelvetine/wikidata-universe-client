import "./navbar.css";
import { Dispatch, SetStateAction } from "react";

import { P5Sketch, WikiverseServiceResponse } from "../../../types";
import { useDeviceCompatabilityCheck } from "../../../providers";

// Sub-Components
import { ReSearchInput } from "../re-search-input/re-search-input";
import { SettingsOpenIndicator } from "../settings-open-indicator/settings-open-indicator";
import { SketchDetailsSummary } from "../sketch-details-summary/sketch-details.summary";
import { useComponentID } from "../../../hooks";

interface NavbarProps {
  sketchRef: P5Sketch | null;
  setSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

/**
 * The Navbar is positioned directly above the "main-display" and contains elements for the Site Title, Re-Search-Input (for starting
 * a new search while one is already active), Sketch Details Summary (statistics about the current search and Graph being displayed),
 * and a open/close indicator for the Sketch Settings menu.
 *
 * @component
 * @param {P5Sketch | null} props.sketchRef - Reference to the P5 sketch instance.
 * @param {Dispatch<SetStateAction<WikiverseServiceResponse | null>>} props.setSketchData - Function to set the initial sketch data.
 */
export const Navbar = ({ sketchRef, setSketchData }: NavbarProps) => {
  const { ID } = useComponentID("navbar");
  const title = sketchRef ? "in 3D" : "the Wikiverse";

  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const exploreTextAsPrimaryTitle = sketchRef && meetsMinScreenSizeReq;

  return (
    <nav id={ID("container")}>
      <div id={ID("layout")}>
        <header id={ID("header")}>
          <h1
            id={ID("title-text")}
            className={exploreTextAsPrimaryTitle ? "secondary" : "primary"}
          >
            {title}
          </h1>
          <h1
            id={ID("explore-text")}
            className={exploreTextAsPrimaryTitle ? "secondary" : "primary"}
          >
            explore
          </h1>
        </header>
        {sketchRef && <ReSearchInput {...{ sketchRef, setSketchData }} />}
        {sketchRef && <SketchDetailsSummary {...{ sketchRef }} />}
        {sketchRef && <SettingsOpenIndicator {...{ sketchRef }} />}
      </div>
    </nav>
  );
};
