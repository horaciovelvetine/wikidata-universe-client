import "./sketch-details-summary.css";
import { createRef, useEffect, useState } from "react";
import { Point3D, P5Sketch } from "../../../../types";
import { showHideSketchDetailsSummary } from "..";
import { useDeviceCompatabilityCheck } from "../../../../contexts";

interface SketchDetailsSummaryProps {
  sketchRef: P5Sketch;
}

const ID = (sufx: string) => `sketch-details-${sufx}`;

export const SketchDetailsSummary = ({
  sketchRef,
}: SketchDetailsSummaryProps) => {
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const [showSketchDetailsSummary, setShowSketchDetailsSummary] = useState(
    sketchRef.state.showSketchDetailsSummary()
  );
  const ContainerRef = createRef<HTMLDivElement>();

  const [topicCount, setTopicCount] = useState(
    sketchRef?.state.topicCount() || 0
  );
  const [statementCount, setStatementCount] = useState(
    sketchRef?.state.topicCount() || 0
  );
  const [camPosition, setCamPosition] = useState(new Point3D());
  const [camFocus, setCamFocus] = useState(new Point3D());

  useEffect(() => {
    // attach interval to update camera position & focus intervals...
    // setup topics and statements to subscribe to sketch updates through state...
    sketchRef.state.addTopicCountSubscriber(setTopicCount);
    sketchRef.state.addStatementCountSubscriber(setStatementCount);
    sketchRef.state.addShowSketchDetailsSummarySubscriber(
      setShowSketchDetailsSummary
    );

    const updateCamValues = () => {
      const cam = sketchRef.P5CAM();
      if (!cam) return; // get sketch cam and update state...
      setCamPosition(new Point3D({ x: cam.eyeX, y: cam.eyeY, z: cam.eyeZ }));
      setCamFocus(
        new Point3D({ x: cam.centerX, y: cam.centerY, z: cam.centerZ })
      );
    };

    const camInterval = setInterval(updateCamValues, 96.6666667);
    return () => clearInterval(camInterval);
  });

  useEffect(() => {
    if (meetsMinScreenSizeReq) {
      showHideSketchDetailsSummary(ContainerRef, showSketchDetailsSummary);
    } else {
      showHideSketchDetailsSummary(ContainerRef, meetsMinScreenSizeReq);
    }
  }, [showSketchDetailsSummary, meetsMinScreenSizeReq, ContainerRef]);

  return (
    <div id={ID("container")} ref={ContainerRef}>
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
