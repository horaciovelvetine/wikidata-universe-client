export function fadeOutElement(ele: HTMLElement) {
  ele.style.transition = "opacity 0.75s ease-in-out";
  ele.style.opacity = "0";
  setTimeout(() => {
    ele.style.transition = "";
    ele.style.display = "none";
  }, 500);
}