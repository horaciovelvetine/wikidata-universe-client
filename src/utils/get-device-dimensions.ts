import { Dimensions } from "../types";
/**
 * Retrieves the current dimensions of the device's viewport.
 *
 * @returns {Dimensions} An object containing the width and height of the viewport.
 */

export function getDeviceDimensions(): Dimensions {
  return { width: innerWidth, height: innerHeight };
}
