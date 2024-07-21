export function fadeInElement(ele: HTMLElement) {
  ele.style.transition = "opacity 0.75s ease-in-out";
  ele.style.opacity = "1";
  setTimeout(() => {
    ele.style.transition = "";
  }, 500);
}