import "./navbar-container.css";
import {
  createRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

// TODO - remove animation
import { transitionHeaderTitleText } from "../animations/transition-header-title-text";
import { P5Sketch } from "../../../types";
import {
  useDeviceCompatabilityCheck,
  WikiverseServiceResponse,
} from "../../../contexts";

// Sub-Components
import { ReSearchInput } from "../re-search-input/re-search-input";
import { SettingsOpenIndicator } from "../settings-open-indicator/settings-open-indicator";
import { SketchDetailsSummary } from "../sketch-details-summary/sketch-details.summary";

interface NavbarContainerProps {
  sketchRef: P5Sketch | null;
  setInitSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

const ID = (sufx: string) => `navbar-${sufx}`;

export const NavbarContainer = ({
  sketchRef,
  setInitSketchData,
}: NavbarContainerProps) => {
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const TitleRef = createRef<HTMLHeadingElement>();
  const ExploreRef = createRef<HTMLHeadingElement>();

  const [title, setTitle] = useState("the Wikiverse");

  useEffect(() => {
    transitionHeaderTitleText(
      TitleRef,
      ExploreRef,
      setTitle,
      meetsMinScreenSizeReq,
      sketchRef
    );
  }, [sketchRef, meetsMinScreenSizeReq, ExploreRef, TitleRef]);

  return (
    <nav id={ID("container")}>
      <div id={ID("layout")}>
        <header id={ID("header")}>
          <h1 id={ID("title-text")} ref={TitleRef}>
            {title}
          </h1>
          <h1 id={ID("explore-text")} ref={ExploreRef}>
            explore
          </h1>
        </header>
        {sketchRef && <ReSearchInput {...{ sketchRef, setInitSketchData }} />}
        {sketchRef && <SketchDetailsSummary {...{ sketchRef }} />}
        {sketchRef && <SettingsOpenIndicator {...{ sketchRef }} />}
      </div>
    </nav>
  );
};
