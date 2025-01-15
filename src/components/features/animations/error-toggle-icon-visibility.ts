import { RefObject } from "react";

/**
 * @method errorToggleIconVisibility() - toggles visibility of the danger colored icon and the regular icon using opacity
 */
export function errorToggleIconVisibility(icon: RefObject<HTMLImageElement>, dngrIcon: RefObject<HTMLImageElement>) {
  if (icon.current && dngrIcon.current) {
    const curIcon = icon.current;
    const curDng = dngrIcon.current;
    curIcon.style.opacity = '0%';
    curDng.style.opacity = '100%';
    setTimeout(() => {
      curDng.style.opacity = '0%';
      curIcon.style.opacity = '100%';
    }, 820)
  }
}