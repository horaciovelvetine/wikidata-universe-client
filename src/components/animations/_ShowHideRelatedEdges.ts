/**
 * Toggles the visibility of related edges by translating the element horizontally.
 *
 * @param ele - The HTML element to be transformed.
 * @param isOpen - A boolean indicating whether the element should be shown (true) or hidden (false).
 * @param time - The duration of the transition effect. Defaults to '0.5s'.
 */
export function showHideRelatedEdges(ele: HTMLElement, isOpen: boolean, time: string = '0.5s') {
  ele.style.transition = `transform ${time} linear`
  if (!isOpen) {
    ele.style.transform = 'translateX(7rem)'
  } else {
    ele.style.transform = 'translateX(0rem)'
  }
}