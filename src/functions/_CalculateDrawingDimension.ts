import { IDimensions } from "../interfaces";
/**
 * Calculates the dimensions for drawing based on the window size.
 * The calculated dimensions maintain a 4:3 aspect ratio (-ish). 
 * Magic values were chose by eyeballing, sorry.
 * 
 * @param window - The window object representing the browser window.
 * @returns The calculated dimensions for drawing.
 */
export function calculateDrawingDimensions(window: Window): IDimensions {
  const calculatedHeight = window.innerHeight * 7 / 8; // 4:3 aspect ratio(-ish)
  const calculatedWidth = window.innerWidth * 7 / 8;
  return { width: calculatedWidth, height: calculatedHeight };
}