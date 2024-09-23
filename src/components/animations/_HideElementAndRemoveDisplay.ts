export function hideElementAndRemoveDisplay(ele: HTMLElement, duration: string = "0.75") {
  ele.style.transition = `opacity ${duration}s ease-in-out`;
  ele.style.opacity = '0';

  setTimeout(() => {
    ele.style.display = "none"; 
  },
    parseFloat(duration) * 1000)
}