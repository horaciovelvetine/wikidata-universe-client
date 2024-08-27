export function fadeInHoveredLabel(ele: HTMLElement, show: boolean, duration: string = '0.06s') {
  const transition = `opacity ${duration} linear`;
  ele.style.transition = transition
  if (show) {
    ele.style.opacity = '1';
  } else {
    ele.style.opacity = '0'
  }
}