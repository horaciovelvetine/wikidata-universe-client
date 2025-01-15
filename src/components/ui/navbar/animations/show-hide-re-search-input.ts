import { RefObject } from "react";

/**
 * @method showHideReSearchInput() - use opacity to hide the input when the screen size is too small and the client should not be modifying their current query.
 */
export function showHideReSearchInput(inputContainerRef: RefObject<HTMLDivElement>, show: boolean) {
  const contEle = inputContainerRef.current
  if (!contEle) return;

  if (show) {
    contEle.style.opacity = '1'
  } else {
    contEle.style.opacity = '0'
  }
}