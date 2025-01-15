import { RefObject } from "react";

/**
 * @method showHideSketchDetailsSummary() - used to add or remove the SketchDetailsSummary container from view depending on user preference. Hidden under the sketch when not active, moved into navbar view.
 */
export function showHideSketchDetailsSummary(contRef: RefObject<HTMLDivElement>, show: boolean) {
  const ele = contRef.current;
  if (!ele) return;
  if (show) {
    ele.style.transform = 'translateY(0%)';
  } else {
    ele.style.transform = 'translateY(125%)';
  }
}