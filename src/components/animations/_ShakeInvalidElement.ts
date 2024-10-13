/**
 * Applies a shaking animation to an invalid HTML element, changing its border and text color to indicate an error.
 * 
 * @param ele - The HTML element to apply the shaking animation to.
 * 
 * The function sets a transition and animation on the element to create a horizontal shake effect.
 * It also changes the border and text color to a danger color.
 * After the animation duration (0.82 seconds), it resets the animation and colors back to their original state.
 */
export function shakeInvalidElement(ele: HTMLElement) {
  ele.style.transition = "border-color 0.82s, color 0.82s";
  ele.style.animation = "horizontal-shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
  ele.style.borderColor = "rgb(var(--danger))";
  ele.style.color = "rgb(var(--danger))";
  setTimeout(() => {
    ele.style.animation = "";
    ele.style.borderColor = "rgb(var(--font))";
    ele.style.color = "rgb(var(--font))";
  }, 820);
}