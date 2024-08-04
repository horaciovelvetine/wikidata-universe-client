import { IDimensions } from '../interfaces';

export function formatWindowSizeString(dimensions: IDimensions): string {
  return `${dimensions.width}x${dimensions.height}`;
}