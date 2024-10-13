/**
 * Fades in or out a hovered label by adjusting its opacity.
 *
 * @param ele - The HTML element to apply the fade effect to.
 * @param show - A boolean indicating whether to show (true) or hide (false) the element.
 * @param duration - The duration of the fade effect, specified as a string (default is '0.06s').
 */
export function fadeInHoveredLabel(ele: HTMLElement, show: boolean, duration: string = '0.06s') {
  ele.style.transition = `opacity ${duration} linear`;
  if (show) {
    ele.style.opacity = '1';
  } else {
    ele.style.opacity = '0'
  }
}