import { RefObject } from "react";

/**
 * @method showHideSketchHUDRef() - used in SketchHUDContainer to show and HIDE the sketch HUD based off of the provided boolean, if the qualifier is True the div is show, else the div is faded and removed from the screen using the default transition & opacity
 */
export function showHideSketchHUDRef(
  ref: RefObject<HTMLDivElement>,
  show: boolean
) {
  const HUD = ref.current;
  if (!HUD) return;

  if (show) {
    HUD.style.display = "grid";
    setTimeout(() => {
      HUD.style.opacity = "1";
    }, 1);
  } else {
    HUD.style.opacity = "0";
    setTimeout(() => {
      HUD.style.display = "none";
    }, 235);
  }
}
