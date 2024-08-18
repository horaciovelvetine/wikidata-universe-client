export function rotateChevIcon(icon: HTMLElement, isOpen: boolean, time: string = '0.25s') {
  const transition = `transform ${time} linear`;

  if (!isOpen) {
    icon.style.transformOrigin = 'center';
    icon.style.transition = transition;
    icon.style.transform = 'rotate(0deg) translateX(0.25rem)';
  } else {
    icon.style.transformOrigin = 'center';
    icon.style.transition = transition
    icon.style.transform = 'rotate(90deg) translateX(-0.2rem)';
  }
}