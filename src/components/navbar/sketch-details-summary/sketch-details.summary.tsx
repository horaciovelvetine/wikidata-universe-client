import "./sketch-details-summary.css";
import { useEffect, useState } from "react";

import { P5Sketch, Point3DImpl } from "../../../types";
import { useDeviceCompatabilityCheck } from "../../../providers";
import { useComponentID } from "../../../hooks";

interface SDSProps {
  sketchRef: P5Sketch;
}

/**
 * A small text display summarizing details about the currently active sketch including counts and camera position. The client can show/hide this display using either the settings menu or the "," (comma) shortcut-key.
 *
 * @apiNote - This component relies on synchronus state and continuous updates using data pulled from the active sketch and relies on several @method useEffect() side-effects to keep react state in sync with the @see P5Sketch object.
 *
 * @param {P5Sketch} props.sketchRef - the currently active sketch
 */
export const SketchDetailsSummary = ({ sketchRef }: SDSProps) => {
  const { ID } = useComponentID("sketch-details");
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const [isShown, setIsShown] = useState(
    sketchRef.state.showSketchDetailsSummary()
  );

  const [topicCount, setTopicCount] = useState(
    sketchRef?.state.topicCount() || 0
  );
  const [statementCount, setStatementCount] = useState(
    sketchRef?.state.statementCount() || 0
  );
  const [camPosition, setCamPosition] = useState(new Point3DImpl());
  const [camFocus, setCamFocus] = useState(new Point3DImpl());

  useEffect(() => {
    // attach interval to update camera position & focus intervals...
    // setup topics and statements to subscribe to sketch updates through state...
    // enables the P5Sketch to 'keypress' listen and toggle isShown with ","
    sketchRef.state.addTopicCountSubscriber(setTopicCount);
    sketchRef.state.addStatementCountSubscriber(setStatementCount);
    sketchRef.state.addShowSketchDetailsSummarySubscriber(setIsShown);

    const updateCamValues = () => {
      const cam = sketchRef.P5CAM();
      if (!cam) return; // get sketch cam and update state...
      setCamPosition(
        new Point3DImpl({ x: cam.eyeX, y: cam.eyeY, z: cam.eyeZ })
      );
      setCamFocus(
        new Point3DImpl({ x: cam.centerX, y: cam.centerY, z: cam.centerZ })
      );
    };

    const camInterval = setInterval(updateCamValues, 96.6666667);
    return () => clearInterval(camInterval);
  });

  return (
    <div
      id={ID("container")}
      className={meetsMinScreenSizeReq && isShown ? "on-screen" : ""}
    >
      <div id={ID("layout")}>
        <div id={ID("counts-container")}>
          <div id={ID("counts-labels-container")}>
            <p id={ID("topics-label")}>topics</p>
            <p id={ID("statements-label")}>statements</p>
          </div>

          <div id={ID("counts-numbers-container")}>
            <p id={ID("topics-count")}>{topicCount}</p>
            <p id={ID("statements-count")}>{statementCount}</p>
          </div>
        </div>
        <div id={ID("cam-container")}>
          <p id={ID("cam-container-label")}>
            <span id={ID("c")}>c</span>
            <span id={ID("a")}>a</span>
            <span id={ID("m")}>m</span>
          </p>

          <div id={ID("cam-data-layout")}>
            <div id={ID("cam-data-label-container")}>
              <p id={ID("cam-position-label")}>pos</p>
              <p id={ID("cam-focus-label")}>focus</p>
            </div>

            <div id={ID("cam-numbers-container")}>
              <p id={ID("cam-data-legend")}>
                <span>[</span>
                <span>x,</span>
                <span>y,</span>
                <span>z</span>
                <span>]</span>
              </p>
              <p id={ID("cam-position")}>{camPosition.string()}</p>
              <p id={ID("cam-focus")}>{camFocus.string()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
