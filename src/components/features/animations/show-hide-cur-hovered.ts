import { RefObject } from "react";
import { Vertex } from "../../../types";

/**
 * @method showHideCurHovered() - 
 */
export function showHideCurHovered(curSelected: Vertex | null, containerRef: RefObject<HTMLDivElement>) {
  const container = containerRef.current
  if (!container) return

  if (curSelected) {
    container.style.opacity = '100%'
  } else {
    container.style.opacity = '0'
  }
}