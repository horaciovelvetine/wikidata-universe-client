/**
 * Toggles the visibility of an HTML element with a fade effect.
 * 
 * @param {HTMLElement} ele - The HTML element to show or hide.
 * @param {boolean} show - A boolean indicating whether to show or hide the element.
 * @param {string} [duration='0.75'] - The duration of the fade effect in seconds or fraction of seconds.
 */
export function toggleElementOpacity(ele: HTMLElement, show: boolean, duration: string = '0.75') {
  ele.style.transition = `opacity ${duration}s ease-in-out`
  if (show) {
    ele.style.opacity = '1';
  } else {
    ele.style.opacity = '0';
  }
}