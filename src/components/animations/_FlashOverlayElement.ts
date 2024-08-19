export function flashOverlayElement(ele: HTMLElement, origEle: HTMLElement, duration: number = 500) {
  const transition = `opacity ${(duration / 2)}ms cubic-bezier(.36,.07,.19,.97)`;
  origEle.style.transition = transition;
  origEle.style.opacity = '0';
  ele.style.transition = transition;
  ele.style.opacity = '1';
  setTimeout(() => {
    ele.style.transition = transition;
    origEle.style.transition = transition;
    origEle.style.opacity = '1';
    ele.style.opacity = '0';
  }, duration);

}