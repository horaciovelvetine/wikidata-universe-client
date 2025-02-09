import { RefObject } from "react";

/**
 * @method showHideMainLandingInput() - show and hide the main landing pages input completely (in the case the API might be offline)
 */
export function showHideMainLandingInput(
  containerRef: RefObject<HTMLDivElement>,
  isOnline: boolean
) {
  const container = containerRef.current;
  if (!container) return;
  if (isOnline) {
    container.style.opacity = "100";
    container.style.display = "flex";
  } else {
    container.style.display = "none";
    container.style.opacity = "0";
  }
}
