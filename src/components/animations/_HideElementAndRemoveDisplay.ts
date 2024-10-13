/**
 * Hides an HTML element by gradually reducing its opacity to 0 over a specified duration,
 * and then sets its display style to "none" after the transition is complete.
 *
 * @param ele - The HTML element to be hidden.
 * @param duration - The duration of the opacity transition in seconds. Defaults to "0.75".
 */
export function hideElementAndRemoveDisplay(ele: HTMLElement, duration: string = "0.75") {
  ele.style.transition = `opacity ${duration}s ease-in-out`;
  ele.style.opacity = '0';
  setTimeout(() => {
    ele.style.display = "none";
  },
    parseFloat(duration) * 1000)
}