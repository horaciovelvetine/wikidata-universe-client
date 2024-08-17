export function rotateChevIcon(icon: HTMLElement, isOpen: boolean) {
  if (isOpen) {
    icon.style.transformOrigin = 'center';
    icon.style.transition = 'transform 0.25s linear';
    icon.style.transform = 'rotate(0deg) translateX(0.25rem)';
  } else {
    icon.style.transformOrigin = 'center';
    icon.style.transition = 'transform 0.25s linear';
    icon.style.transform = 'rotate(-90deg) translateX(-0.2rem)';
  }
}