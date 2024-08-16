export function toggleMenuOptionVisibility(ele: HTMLElement, isOpen: boolean) {
  if (isOpen) {
    ele.style.transition = 'transform 0.25s ease-in-out';
    ele.style.transform = 'translateY(5rem)'
  } else {
    ele.style.transition = 'transform 0.25s ease-in-out';
    ele.style.transform = 'translateY(0.15rem)'
  }
}