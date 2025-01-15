import { RefObject } from "react";

export function showHideSettingsOpenIndicator(ref: RefObject<HTMLDivElement>, show: boolean) {
  const ele = ref.current
  if (!ele) return;

  if (show) {
    ele.style.transform = 'translateX(120%)'
  } else {
    ele.style.transform = 'translateX(0%)'
  }
}
