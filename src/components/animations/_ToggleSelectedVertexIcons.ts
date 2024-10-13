/**
 * Toggles the visibility of selected and non-selected vertex icons with a transition effect.
 *
 * @param noSelIcon - The HTML element representing the non-selected icon.
 * @param selIcon - The HTML element representing the selected icon.
 * @param isOpen - A boolean indicating whether the selected icon should be visible.
 * @param duration - The duration of the transition effect in milliseconds. Defaults to 235ms.
 */
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