export function showHideRelatedEdges(ele: HTMLElement, isOpen: boolean, time: string = '0.25s') {
  ele.style.transition = `transform ${time} linear`
  if (!isOpen) {
    ele.style.transform = 'translateX(5rem)'
  } else {
    ele.style.transform = 'translateX(0rem)'
  }
}