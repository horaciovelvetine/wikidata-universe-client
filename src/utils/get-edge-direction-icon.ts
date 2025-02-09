import { ArrowBoth, ArrowFrom, ArrowTo } from "../assets/icons";
import { Vertex, Edge } from "../types";
import { DIRECTION } from "../types/data/edge";

interface DirectionIndicator {
  dir: string;
  icon: string;
}

/**
 * @method getEdgeDirectionIcon() - uses the provided edge to determine the apprpriate directional icon to display inside the RelatedEdgesInfo component. Parallel edges are determined by having the edge check itself against each of the curRelEdges sub-array.
 */
export function getEdgeDirectionIcon(curSelection: Vertex, edge: Edge, relEdges: Edge[]): DirectionIndicator {
  if (edge.hasExistingParallelEdgeInRelated(relEdges)) {
    return { dir: DIRECTION.PARALLEL, icon: ArrowBoth }
  }

  return edge.srcId === curSelection.id ? { dir: DIRECTION.OUTGOING, icon: ArrowTo } : { dir: DIRECTION.INCOMING, icon: ArrowFrom };
}