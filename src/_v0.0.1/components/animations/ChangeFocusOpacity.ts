/**
 * Changes the opacity of an HTML element based on its focus state.
 *
 * @param ele - The HTML element whose opacity will be changed.
 * @param isFocused - A boolean indicating whether the element is focused.
 * @param time - The duration of the opacity transition (default is '0.25s').
 * @param opMax - The opacity value when the element is focused (default is '1').
 * @param opMin - The opacity value when the element is not focused (default is '0.35').
 */
export function changeFocusOpacity(ele: HTMLElement, isFocused: boolean, time: string = '0.25s', opMax: string = '1', opMin: string = '0.35') {
  ele.style.transition = 'opacity ' + time + ' linear';
  if (isFocused) {
    ele.style.opacity = opMax;
  } else {
    ele.style.opacity = opMin;
  }
}