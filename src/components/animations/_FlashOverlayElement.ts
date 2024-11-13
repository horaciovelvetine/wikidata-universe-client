/**
 * Applies a flash overlay effect to an HTML element by transitioning its opacity.
 *
 * @param ele - The HTML element to be flashed.
 * @param origEle - The original HTML element that will be overlaid.
 * @param duration - The duration of the flash effect in milliseconds. Defaults to 500ms.
 */
export function flashOverlayElement(ele: HTMLElement, origEle: HTMLElement, duration: number = 500) {
  const transition = `opacity ${(duration / 2)}ms cubic-bezier(.36,.07,.19,.97)`;
  origEle.style.transition = transition;
  ele.style.transition = transition;
  origEle.style.opacity = '0';
  ele.style.opacity = '1';
  setTimeout(() => {
    origEle.style.opacity = '1';
    ele.style.opacity = '0';
  }, duration);

}