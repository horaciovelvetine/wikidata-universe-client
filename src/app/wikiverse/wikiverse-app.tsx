import "./wikiverse-app.css";
import { useState } from "react";

import {
  Footer,
  VerticalTitle,
  IncompatibleDeviceNotice,
  Navbar,
  ParticlesSketch,
  SketchContainer,
  SketchHUD,
  ServiceOfflineNotice,
  LandingPageInput,
} from "../../components";
import { P5Sketch, WikiverseServiceResponse } from "../../types";
import {
  DeviceCompatabilityProvider,
  WikiverseServiceProvider,
} from "../../providers";
import { useComponentID } from "../../hooks";

/**
 * The main @component for the Wikiverse application.
 *
 * This component sets up the necessary providers and renders the main layout
 * of the application, including the navbar, background sketch, service notices,
 * sketch HUD, and footer. It also manages the state for the sketch reference,
 * initial sketch data, and whether the tutorial sketch is active.
 */
export const WikiverseApp = () => {
  const { ID } = useComponentID("wikiverse-app");
  const [sketchRef, setSketchRef] = useState<P5Sketch | null>(null);
  const [sketchData, setSketchData] = useState<WikiverseServiceResponse | null>(
    null
  );
  const [isTutorialSketch, setIsTutorialSketch] = useState(false);

  return (
    <DeviceCompatabilityProvider>
      <WikiverseServiceProvider useLocalAPI>
        <div id={ID("main-container")}>
          <div id={ID("top-left-fill")}></div>

          <Navbar {...{ sketchRef, setSketchData }} />

          <div id={ID("top-right-fill")}></div>
          <VerticalTitle />

          <div id={ID("main-display")} onContextMenu={e => e.preventDefault()}>
            <ParticlesSketch {...{ sketchData }} />

            <SketchHUD
              {...{
                setSketchData,
                sketchRef,
                isTutorialSketch,
                setIsTutorialSketch,
              }}
            />
            <LandingPageInput {...{ sketchData, setSketchData }} />
            <SketchContainer
              {...{ sketchData, setSketchRef, isTutorialSketch }}
            />
            <ServiceOfflineNotice />
            <IncompatibleDeviceNotice />
          </div>

          <div id={ID("mid-right-fill")}></div>

          <div id={ID("bot-left-fill")}></div>

          <Footer {...{ setIsTutorialSketch, setSketchData }} />

          <div id={ID("bot-right-fill")}></div>
        </div>
      </WikiverseServiceProvider>
    </DeviceCompatabilityProvider>
  );
};
