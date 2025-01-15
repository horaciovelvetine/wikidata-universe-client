import { Dimensions } from "../types";

/**
 * Shortens a given string based on the width of its container.
 * 
 * @method abridgeString
 * @param {string | undefined | null} input - The string to be shortened.
 * @param {Dimensions} contSize - The dimensions of the container.
 * @returns {string} - The shortened string with '...' appended if it exceeds the maximum length.
 * @see CurHoveredInfo
 */
export function abridgeString(input: string | undefined | null, contSize: Dimensions): string {
  if (!input) return '';
  const scale = 0.08;
  const maxLngth = Math.floor((contSize.width * scale))
  if (input.length <= maxLngth) return input;
  return input.substring(0, maxLngth) + '...';
}