import { RefObject } from "react";

/**
 * @method errorShakeMainLandingInput() - shakes the main landing page input and re-colors individual elements to the (--danger) warning color
 */
export function errorShakeMainLandingInput(input: RefObject<HTMLInputElement>) {
  const ele = input.current
  if (ele) {
    ele.style.transition = "border-color 0.82s, color 0.82s, box-shadow 0.82s, caret-color 0.82s";
    ele.style.animation = "horizontal-shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
    ele.style.borderColor = "rgb(var(--danger))";
    ele.style.caretColor = "rgb(var(--danger))";
    ele.style.color = "rgb(var(--danger))";
    ele.style.boxShadow = "0 0 15px rgba(var(--danger), 0.5)";
    setTimeout(() => {
      ele.style.animation = "";
      ele.style.borderColor = "rgb(var(--hyperlink))";
      ele.style.boxShadow = "0 0 15px rgba(var(--hyperlink), 0.5)";
      ele.style.color = "rgb(var(--font))";
      ele.style.caretColor = "rgb(var(--font))";
    }, 820);
  }
}