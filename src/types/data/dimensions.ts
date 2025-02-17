/**
 * Interface representing dimensions with width and height.
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Checks if the given dimensions are the default dimensions (width and height are both 0).
 *
 * @param dims - The dimensions to check.
 * @returns True if the dimensions are default, otherwise false.
 */
export function dimensionsAreDefault(dims: Dimensions): boolean {
  return dims.width === 0 && dims.height === 0;
}

/**
 * Returns the default dimensions with width and height set to 0.
 *
 * @returns The default dimensions.
 */
export function defaultDimensions(): Dimensions {
  return { width: 0, height: 0 };
}

/**
 * Checks if the given dimensions meet the minimum size of (700 x 750).
 *
 * @param dims - The dimensions to check.
 * @returns `true` if the dimensions meet the minimum requirements, `false` otherwise.
 */
export function dimensionsMeetMinimumRequirements(dims: Dimensions) {
  return dims.width >= 701 && dims.height >= 750;
}
