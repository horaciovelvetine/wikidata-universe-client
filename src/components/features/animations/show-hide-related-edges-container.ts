import { RefObject } from "react";
import { Edge } from "../../../types";

export function showHideRelatedEdgesContainer(containerRef: RefObject<HTMLDivElement>, relEdges: Edge[]) {
  const container = containerRef.current
  if (!container) return;

  if (relEdges.length) {
    container.style.opacity = '100%'
  } else {
    container.style.opacity = '0'
  }
}