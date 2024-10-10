/**
 * Calculates the initial layout dimensions based on the window's inner dimensions.
 * 
 * @returns An object containing the width and height of the layout.
 *          - `width`: 80% of the window's inner width, rounded to the nearest integer.
 *          - `height`: 85% of the window's inner height, rounded to the nearest integer.
 */
export const calcInitLayoutDimensions = () => {
  return { width: Math.round(window.innerWidth * 0.8), height: Math.round(window.innerHeight * 0.85) };
}