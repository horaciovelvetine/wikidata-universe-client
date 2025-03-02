import "./currently-selected-info.css";
import { useEffect, useState } from "react";

import { Vertex as NoVertSel, VertexSel } from "../../../assets/icons";
import { P5Sketch } from "../../../types";
import { useComponentID } from "../../../hooks";

interface CSIProps {
  sketchRef: P5Sketch;
}

/**
 * Displays text details in the lower left corner of the @see SketchHUD (the enclosing component).
 * Currently selected state is derived from the @see ManagedState attached to the @param props.sketchRef
 * instance.
 *
 * @param {P5Sketch} props.sketchRef - reference to the P5Sketch instance
 */
export const CurrentlySelectedInfo = ({ sketchRef }: CSIProps) => {
  const { ID } = useComponentID("cur-selected-info");
  const [curSelectedRef, setCurSelectedRef] = useState(
    sketchRef.state.curSelected()
  );

  useEffect(() => {
    // subscribe to curSlectedRef state from sketch
    sketchRef.state.addCurSelectedSubscriber(setCurSelectedRef);
  });

  return (
    <div id={ID("container")}>
      <div id={ID("layout")}>
        <div id={ID("icon-container")}>
          <img
            id={ID("vertex-icon")}
            src={NoVertSel}
            className={curSelectedRef ? "hidden" : "on-screen"}
          />
          <img
            id={ID("selected-icon")}
            src={VertexSel}
            className={curSelectedRef ? "on-screen" : "hidden"}
          />
        </div>
        <div id={ID("text-container")}>
          <div id={ID("title-span")}>
            <a
              id={ID("label-link")}
              href={curSelectedRef?.url()}
              target="_blank"
            >
              {curSelectedRef?.label}
            </a>
            <p id={ID("cur-sel-coords")}>{curSelectedRef?.coords.string()}</p>
          </div>
          <p id={ID("topic-desc")}>{curSelectedRef?.description}</p>
        </div>
      </div>
    </div>
  );
};
