export function flashOverlayElement(ele: HTMLElement, duration: number = 500) {
  const transition = `opacity ${(duration / 2)}ms linear`;
  ele.style.transition = transition;
  ele.style.opacity = '1';
  setTimeout(() => {
    ele.style.transition = transition;
    ele.style.opacity = '0';
  }, 500);

}