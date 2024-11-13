/**
 * Toggles the display visibility of an HTML element.
 *
 * @param ele - The HTML element whose display visibility is to be toggled.
 * @param show - A boolean indicating whether to show or hide the element.
 * @param displayType - The CSS display type to apply when showing the element. Defaults to 'block'.
 */
export function toggleDisplayVisibility(ele: HTMLElement, show: boolean, displayType: string = 'block') {
  if (show) {
    ele.style.display = displayType
  } else {
    ele.style.display = 'none'
  }
}