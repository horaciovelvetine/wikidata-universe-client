import "./wikiverse-app.css";
import { memo, useState } from "react";

import {
  Footer,
  VerticalTitle,
  IncompatibleDeviceNotice,
  Navbar,
  BackgroundSketch,
  SketchContainer,
  SketchHUD,
  ServiceOfflineNotice,
} from "../../components";
import { P5Sketch } from "../../types";
import {
  WikiverseServiceResponse,
  DeviceCompatabilityProvider,
  WikiverseServiceProvider,
} from "../../contexts";
import { useComponentID } from "../../hooks";

const BGSketchMemo = memo(BackgroundSketch);

const SketchMemo = memo(SketchContainer, (prev, next) => {
  return prev.initSketchData === next.initSketchData;
});

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
  const [initSketchData, setInitSketchData] =
    useState<WikiverseServiceResponse | null>(null);
  const [isTutorialSketch, setIsTutorialSketch] = useState(false);

  return (
    <DeviceCompatabilityProvider>
      <WikiverseServiceProvider useLocalAPI>
        <div id={ID("main-container")}>
          <div id={ID("top-left-fill")}></div>

          <Navbar {...{ sketchRef, setInitSketchData }} />

          <div id={ID("top-right-fill")}></div>
          <VerticalTitle />

          <div id={ID("main-display")} onContextMenu={e => e.preventDefault()}>
            <BGSketchMemo {...{ initSketchData }} />

            <ServiceOfflineNotice />
            <IncompatibleDeviceNotice />

            <SketchHUD
              {...{
                setInitSketchData,
                sketchRef,
                isTutorialSketch,
                setIsTutorialSketch,
              }}
            />
            {initSketchData && (
              <SketchMemo
                {...{ initSketchData, setSketchRef, isTutorialSketch }}
              />
            )}
          </div>

          <div id={ID("mid-right-fill")}></div>

          <div id={ID("bot-left-fill")}></div>

          <Footer {...{ setIsTutorialSketch, setInitSketchData }} />

          <div id={ID("bot-right-fill")}></div>
        </div>
      </WikiverseServiceProvider>
    </DeviceCompatabilityProvider>
  );
};
