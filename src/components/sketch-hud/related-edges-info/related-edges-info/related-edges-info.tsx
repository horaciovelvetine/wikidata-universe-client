import "./related-edges-info.css";
import { useEffect, useState } from "react";

import { EdgeImpl, SketchRefProps, VertexImpl } from "../../../../types";
// Sub-Component(s)
import { RelatedEdgeItem } from "../related-edge-item/related-edge-item";
import { useComponentID } from "../../../../hooks";

/**
 * Displays a list of {@link EdgeImpl} objects in the lower right hand corner of the {@link SketchHUD}
 * (the enclosing component). Currently selected state is derived from the {@link ManagedState} attached
 * to the sketch instance.
 *
 * @component
 * @param {P5Sketch} sketchRef - reference to the currently active sketch instance
 *
 * @hooks
 * - useState() - currently selected state is derived from the {@link ManagedState} attached to the sketch
 * - useEffect() - used to synchronize a derivative state from externally managed and changed currently
 * selected state.
 */
export const RelatedEdgesInfo = ({ sketchRef }: SketchRefProps) => {
  const { ID } = useComponentID("rel-edges-info");
  const [curSelectedRef, setCurSelectedRef] = useState<VertexImpl | null>(
    sketchRef.state.curSelected()
  );
  const [relEdges, setRelEdges] = useState<EdgeImpl[]>(
    sketchRef.graphset.getRelatedEdges(curSelectedRef)
  );

  useEffect(() => {
    // Let sketch know about curSelected subscriber
    sketchRef.state.addCurSelectedSubscriber(setCurSelectedRef);
  });

  useEffect(() => {
    // setup related edges, follow up effect places rel-edges on-screen
    setRelEdges(sketchRef.graphset.getRelatedEdges(curSelectedRef));
  }, [curSelectedRef, sketchRef.graphset]);

  return (
    <div
      id={ID("container")}
      className={relEdges.length > 0 ? "on-screen" : "hidden"}
    >
      <h3 id={ID("title")}>related statments</h3>
      <div id={ID("details-container")} onWheel={e => e.stopPropagation()}>
        <ul id={ID("list")}>
          {curSelectedRef &&
            relEdges.map(edge => (
              <RelatedEdgeItem
                {...{ edge, sketchRef, curSelectedRef, relEdges }}
                key={`edge-${edge.srcId}-${edge.tgtId}`}
              />
            ))}
        </ul>
      </div>
    </div>
  );
};
