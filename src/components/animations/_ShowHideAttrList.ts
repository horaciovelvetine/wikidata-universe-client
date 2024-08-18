export function showHideAttrList(ele: HTMLElement, isOpen: boolean) {
  if (!isOpen) {
    ele.style.transition = 'transform 0.25s linear';
    ele.style.transform = 'translateY(5rem)';
  } else {
    ele.style.transition = 'transform 0.25s linear';
    ele.style.transform = 'translateY(0rem)';

  }
}