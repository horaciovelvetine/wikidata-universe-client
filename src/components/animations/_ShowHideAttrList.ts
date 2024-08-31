export function showHideAttrList(ele: HTMLElement, isOpen: boolean, time: string = '0.25s') {
  ele.style.transition = `transform ${time} linear`;
  if (!isOpen) {
    ele.style.transform = 'translateY(5rem)';
  } else {
    ele.style.transform = 'translateY(0rem)';
  }
}