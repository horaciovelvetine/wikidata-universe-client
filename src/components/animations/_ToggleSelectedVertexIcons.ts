export function toggleSelectedVertexIcon(noSelIcon: HTMLElement, selIcon: HTMLElement, isOpen: boolean, duration: number = 235) {
  const transition = `opacity ${duration}ms linear`;
  noSelIcon.style.transition = transition;
  selIcon.style.transition = transition;
  if (isOpen) {
    selIcon.style.opacity = '1';
    noSelIcon.style.opacity = '0';
  } else {
    selIcon.style.opacity = '0';
    noSelIcon.style.opacity = '1';
  }
}