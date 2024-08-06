export function fadeOutElement(ele: HTMLElement, duration: string = "1s"): void {
  ele.style.transition = "opacity " + duration + " ease-in-out";
  ele.style.opacity = "0";
  const timeout = parseFloat(duration) * 1000;
  setTimeout(() => {
    ele.style.transition = "";
    ele.style.display = "none";
  }, timeout);
}