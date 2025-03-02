import "./currently-hovered-info.css";
import { useState, useEffect } from "react";

import { Vertex as VertIcon } from "../../../assets/icons";
import { P5Sketch, VertexImpl } from "../../../types";
import { useComponentID } from "../../../hooks";

interface CHIProps {
  sketchRef: P5Sketch;
}

/**
 * Displays text details in the upper left corner of the @see SketchHUD (the enclosing component).
 * Currently hovered state is derived from the @see ManagedState attached to the @param props.sketchRef
 * instance.
 *
 * @param {P5Sketch} props.sketchRef - reference to the P5Sketch instance
 */
export const CurrentlyHoveredInfo = ({ sketchRef }: CHIProps) => {
  const { ID } = useComponentID("cur-hovered-info");
  const [curHoveredRef, setCurHoveredRef] = useState<VertexImpl | null>(null);

  useEffect(() => {
    // lets sketch know to update component on state changes
    sketchRef.state.addCurHoveredSubscriber(setCurHoveredRef);
  });

  return (
    <div id={ID("container")} className={curHoveredRef ? "on-screen" : ""}>
      <div id={ID("layout")}>
        <div id={ID("icon-container")}>
          <img id={ID("icon")} src={VertIcon} />
        </div>
        <div id={ID("text-container")}>
          <div id={ID("title-span")}>
            <h2 id={ID("title")}>{curHoveredRef?.label}</h2>
            <p id={ID("cur-hov-coords")}>{curHoveredRef?.coords.string()}</p>
          </div>
          {/* <p id={ID("desc-abrdg")}>{desc}</p> */}
        </div>
      </div>
    </div>
  );
};
