import "./wikiverse-app.css";
import { memo, useState } from "react";

import { Footer, VerticalTitle, IncompatibleDeviceNotice } from "../components";
import {
  ApiOfflineNotice,
  BackgroundSketchContainer,
  SketchContainer,
  SketchHUD,
} from "../features";
import { P5Sketch } from "../types";
import { NavbarContainer } from "../components/navbar";
import {
  WikiverseServiceResponse,
  DeviceCompatabilityProvider,
  WikiverseServiceProvider,
} from "../contexts";

const ID = (sufx: string) => `wikiverse-app-${sufx}`;

const BGSketchMemo = memo(BackgroundSketchContainer);

const SketchMemo = memo(SketchContainer, (prev, next) => {
  return prev.initSketchData === next.initSketchData;
});

export const WikiverseApp = () => {
  const [sketchRef, setSketchRef] = useState<P5Sketch | null>(null);
  const [initSketchData, setInitSketchData] =
    useState<WikiverseServiceResponse | null>(null);
  const [isTutorialSketch, setIsTutorialSketch] = useState(false);

  return (
    <DeviceCompatabilityProvider>
      <WikiverseServiceProvider useLocalAPI>
        <div id={ID("main-cont")}>
          {/* 1::EMPTY */}
          <div id={ID("top-left-fill")}></div>

          <NavbarContainer {...{ sketchRef, setInitSketchData }} />

          {/* 3::EMPTY */}
          <div id={ID("top-right-fill")}></div>

          <VerticalTitle />

          <div id={"main-display"} onContextMenu={e => e.preventDefault()}>
            <BGSketchMemo {...{ initSketchData }} />

            <ApiOfflineNotice />
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

          {/* 6::EMPTY */}
          <div id={ID("mid-right-fill")}></div>

          {/* 7::EMPTY */}
          <div id={ID("bot-left-fill")}></div>

          <Footer {...{ setIsTutorialSketch, setInitSketchData }} />

          {/* 9::EMPTY */}
          <div id={ID("bot-right-fill")}></div>
        </div>
      </WikiverseServiceProvider>
    </DeviceCompatabilityProvider>
  );
};
