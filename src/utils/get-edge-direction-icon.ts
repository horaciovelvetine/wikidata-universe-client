import { ArrowBoth, ArrowFrom, ArrowTo } from "../assets/icons";
import { VertexImpl } from "../types";
import { DIRECTION, EdgeImpl } from "../types/data/edge";

interface DirectionIndicator {
  dir: string;
  icon: string;
}

/**
 * @method getEdgeDirectionIcon() - uses the provided edge to determine the apprpriate directional icon to display inside the RelatedEdgesInfo component. Parallel edges are determined by having the edge check itself against each of the curRelEdges sub-array.
 */
export function getEdgeDirectionIcon(
  curSelection: VertexImpl,
  edge: EdgeImpl,
  relEdges: EdgeImpl[]
): DirectionIndicator {
  if (edge.hasExistingParallelEdgeInRelated(relEdges)) {
    return { dir: DIRECTION.PARALLEL, icon: ArrowBoth };
  }

  return edge.srcId === curSelection.id
    ? { dir: DIRECTION.OUTGOING, icon: ArrowTo }
    : { dir: DIRECTION.INCOMING, icon: ArrowFrom };
}
