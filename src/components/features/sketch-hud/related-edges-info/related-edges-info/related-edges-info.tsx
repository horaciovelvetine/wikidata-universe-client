import "./related-edges-info.css";
import { Edge, Vertex, P5Sketch } from "../../../../../types";
import { createRef, useEffect, useState } from "react";
import { RelatedEdgeItem } from "..";
import { showHideRelatedEdgesContainer } from "../../../animations/show-hide-related-edges-container";

interface RelatedEdgesInfoProps {
  sketchRef: P5Sketch;
}

const ID = (sufx: string) => `rel-edges-info-${sufx}`;

export const RelatedEdgesInfo = ({ sketchRef }: RelatedEdgesInfoProps) => {
  const [curSelectedRef, setCurSelectedRef] = useState<Vertex | null>(
    sketchRef.state.curSelected()
  );
  const [relEdges, setRelEdges] = useState<Edge[]>(
    sketchRef.graphset.getRelatedEdges(curSelectedRef)
  );

  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    // Let sketch know about curSelected subscriber
    sketchRef.state.addCurSelectedSubscriber(setCurSelectedRef);
  });

  useEffect(() => {
    // setup related edges, followup effect places rel-edges on-screen
    setRelEdges(sketchRef.graphset.getRelatedEdges(curSelectedRef));
  }, [curSelectedRef, sketchRef.graphset]);

  useEffect(() => {
    showHideRelatedEdgesContainer(containerRef, relEdges);
  }, [relEdges, containerRef]);

  return (
    <div id={ID("container")} ref={containerRef}>
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
