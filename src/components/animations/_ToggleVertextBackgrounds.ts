export function toggleVertextBackgrounds(ele: HTMLElement, isOpen: boolean, duration: number = 235) {
  ele.style.transition = `background-color ${duration}ms linear`;
  if (isOpen) {
    ele.style.backgroundColor = 'rgba(var(--sketch-bg), 0.75)';
  } else {
    ele.style.backgroundColor = 'transparent';
  }

}