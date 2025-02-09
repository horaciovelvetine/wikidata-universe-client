import { Dimensions } from "../types";

/**
 * @method getMainDispDimensions() - grabs the named container where the sketch is being drawn to let the sketch (& other dependant elements and functionality) how much space it has in PX and as a useable object (Dimensions)
 */
export function getMainDispDimensions(): Dimensions {
  const container = window.document.getElementById("main-display");
  return container
    ? new Dimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      })
    : new Dimensions();
}
