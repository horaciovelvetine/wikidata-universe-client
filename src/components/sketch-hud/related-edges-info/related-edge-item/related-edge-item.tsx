import "./related-edge-item.css";
import { Vertex as NoVertSel, VertexSel } from "../../../../assets/icons";

import { Vertex, VertexImpl, P5Sketch, EdgeImpl } from "../../../../types";
import { getEdgeDirectionIcon } from "../../../../utils/get-edge-direction-icon";
import { _bl } from "../../../../app";
import { useComponentID } from "../../../../hooks";

interface RelatedEdgeItemProps {
  edge: EdgeImpl;
  sketchRef: P5Sketch;
  curSelectedRef: VertexImpl;
  relEdges: EdgeImpl[];
}

/**
 * A sub-component used inside of the {@link RelatedEdgesInfo} component which summarizes an {@link EdgeImpl} item.
 * Many Item's are typically drawn as a part of displaying the Edge's related to a given {@link VertexImpl}.
 *
 * @component
 * @param {Edge} props.edge - the Edge details being summarized
 * @param {P5Sketch} props.sketchRef - reference to the currently active sketch
 * @param {curSelectedRef} props.curSelectedRef - reference to the currently selected {@link VertexImpl}
 * @param {Edge[]} props.relEdges - used to determine the correct directional icon to use with this edge
 *
 * @remark
 * "Edges" follow a statement syntax with a source, target, and property @example "Kevin Bacon is an Actor"
 * The source is "Kevin Bacon", the target "Actor", and the property "occupation of". Similarly this component
 * is meant to read as a "statement" visually to the user based on the context of the state of the current selection
 */
export const RelatedEdgeItem = ({
  edge,
  sketchRef,
  curSelectedRef,
  relEdges,
}: RelatedEdgeItemProps) => {
  const { ID } = useComponentID("edge-item");
  const alt = sketchRef.graphset.getAltVertex(edge, curSelectedRef);
  const prop = sketchRef.graphset.getProperty(edge.propertyId);
  const { dir, icon } = getEdgeDirectionIcon(curSelectedRef, edge, relEdges);

  // Focuses the in-sketch camera on the vert target
  const onVertexIconClick = (e: React.MouseEvent, vert: Vertex | null) => {
    e.stopPropagation();
    if (!vert) return;
    sketchRef.CAM().setLookAtTgt(vert.coords);
  };

  return (
    <li className={ID("container")}>
      <img
        src={VertexSel}
        className={ID("cur-vert-icon")}
        onClick={e => onVertexIconClick(e, curSelectedRef)}
      />
      <img src={icon} className={ID("dir-icon")} />

      <a href={prop?.url()} target={_bl} className={ID("property-source-link")}>
        <p className={ID(`property-label-${dir}`)}>{prop?.label}</p>
      </a>

      <img src={icon} className={ID("dir-icon")} />
      <span
        className={ID("alt-topic-span")}
        onClick={e => onVertexIconClick(e, alt)}
      >
        <img src={NoVertSel} className={ID("alt-vert-icon")} />
        <p className={ID("tgt-label")}>{alt?.label}</p>
      </span>
    </li>
  );
};
