export function showHideRelatedEdges(ele: HTMLElement, isOpen: boolean, time: string = '0.25s') {
  const transition = `transform ${time} linear`
  if (!isOpen) {
    ele.style.transition = transition;
    ele.style.transform = 'translateX(5rem)'
  } else {
    ele.style.transition = transition;
    ele.style.transform = 'translateX(0rem)'
  }
}