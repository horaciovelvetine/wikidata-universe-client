export function changeFocusOpacity(ele: HTMLElement, isFocused: boolean, time: string = '0.25s', opMax: string = '1', opMin: string = '0.35') {
  ele.style.transition = 'opacity ' + time + ' linear';
  if (isFocused) {
    ele.style.opacity = opMax;
  } else {
    ele.style.opacity = opMin;
  }
}