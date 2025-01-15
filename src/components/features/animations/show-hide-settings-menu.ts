import { RefObject } from "react";

/**
 * @method showHideSettingsMenu() - show and hide the on-screen controls for the settings menu, called inside the SketchSettings component
 */
export function showHideSettingsMenu(ele: RefObject<HTMLDivElement>, show: boolean) {
  const display = ele.current;
  if (!display) return;

  if (show) {
    display.style.display = 'flex'
    setTimeout(() => {
      display.style.opacity = '1'
    }, 1)
  } else {
    display.style.opacity = '0'
    setTimeout(() => {
      display.style.display = 'none'
    }, 235)
  }
}