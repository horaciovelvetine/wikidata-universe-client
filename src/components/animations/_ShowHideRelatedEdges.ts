export function showHideRelatedEdges(ele: HTMLElement, isOpen: boolean, time: string = '0.5s') {
  ele.style.transition = `transform ${time} linear`
  if (!isOpen) {
    ele.style.transform = 'translateX(7rem)'
  } else {
    ele.style.transform = 'translateX(0rem)'
  }
}