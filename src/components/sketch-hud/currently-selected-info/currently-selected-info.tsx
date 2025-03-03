import "./currently-selected-info.css";
import { useEffect, useState } from "react";

import { Vertex as NoVertSel, VertexSel } from "../../../assets/icons";
import { SketchRefProps } from "../../../types";
import { useComponentID } from "../../../hooks";

/**
 * Displays text details in the lower left corner of the {@link SketchHUD} (the enclosing component).
 * Currently selected state is derived from the {@link ManagedState} attached to the sketch instance.
 *
 * @component
 * @param {P5Sketch} sketchRef - reference to the currently active sketch instance
 *
 * @hooks
 * - useState() - curSelectedRef is the currently selected vertex state which is managed by the sketch
 */
export const CurrentlySelectedInfo = ({ sketchRef }: SketchRefProps) => {
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
