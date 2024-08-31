export function fadeInHoveredLabel(ele: HTMLElement, show: boolean, duration: string = '0.06s') {
  ele.style.transition = `opacity ${duration} linear`;
  if (show) {
    ele.style.opacity = '1';
  } else {
    ele.style.opacity = '0'
  }
}