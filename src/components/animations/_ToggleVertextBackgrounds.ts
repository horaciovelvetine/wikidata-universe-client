export function toggleVertextBackgrounds(ele: HTMLElement, isOpen: boolean, opacity: string = '0.1', duration: number = 235) {
  ele.style.transition = `background-color ${duration}ms linear`;
  if (isOpen) {
    ele.style.backgroundColor = `rgba(var(--sketch-bg), ${opacity})`;
  } else {
    ele.style.backgroundColor = 'transparent';
  }

}