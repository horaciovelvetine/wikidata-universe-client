import { RefObject } from "react";
import { Vertex } from "../../types";

/**
 * @method swapCurSelectedVertexIcons() - toggles between the gold outlined Vertex icon when a Vertex is selected and the White default icon when none is selected.
 */
export function swapCurSelectedVertexIcons(
  icon: RefObject<HTMLImageElement>,
  selIcon: RefObject<HTMLImageElement>,
  curSelected: Vertex | null
) {
  const iconRef = icon.current;
  const selRef = selIcon.current;

  if (!iconRef || !selRef) return;

  if (curSelected) {
    iconRef.style.opacity = "0";
    selRef.style.opacity = "100";
  } else {
    iconRef.style.opacity = "100";
    selRef.style.opacity = "0";
  }
}
