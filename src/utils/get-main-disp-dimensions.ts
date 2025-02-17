import { defaultDimensions, Dimensions } from "../types";

/**
 * @method getMainDispDimensions() - grabs the named container where the sketch is being drawn to let the sketch (& other dependant elements and functionality) how much space it has in PX and as a useable object (Dimensions)
 */
export function getMainDispDimensions(): Dimensions {
  const container = window.document.getElementById(
    "wikiverse-app-main-display"
  );
  return container
    ? {
        width: container.clientWidth,
        height: container.clientHeight,
      }
    : defaultDimensions();
}
