import { RefObject } from "react";

/**
 * @method errorShakeMainLandingButton() - shakes the button element (which contains the Search icon) and re-colors various aspects to the (--danger) red
 */
export function errorShakeMainLandingButton(button: RefObject<HTMLElement>) {
  const ele = button.current
  if (ele) {
    ele.style.transition = 'border-color 0.82s, box-shadow 0.82s'
    ele.style.animation = "horizontal-shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
    ele.style.borderColor = 'rgb(var(--danger))'
    ele.style.boxShadow = 'box-shadow: 0 0 5px rgba(var(--danger), 0.1);'
    setTimeout(() => {
      ele.style.animation = "";
      ele.style.borderColor = 'rgb(var(--font))'
      ele.style.boxShadow = 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);'
    }, 820)
  }

}