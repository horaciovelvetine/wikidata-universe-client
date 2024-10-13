/**
 * Toggles the background color of a given HTML element.
 *
 * @param ele - The HTML element whose background color will be toggled.
 * @param isOpen - A boolean indicating whether the background should be visible (true) or transparent (false).
 * @param opacity - The opacity level of the background color when it is visible. Defaults to '0.1'.
 * @param duration - The duration of the background color transition in milliseconds. Defaults to 235ms.
 */
export function toggleVertextBackgrounds(ele: HTMLElement, isOpen: boolean, opacity: string = '0.1', duration: number = 235) {
  ele.style.transition = `background-color ${duration}ms linear`;
  if (isOpen) {
    ele.style.backgroundColor = `rgba(var(--sketch-bg), ${opacity})`;
  } else {
    ele.style.backgroundColor = 'transparent';
  }
}