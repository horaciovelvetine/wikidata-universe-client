export function fadeInElement(ele: HTMLElement, duration: string = "0.75s"): void {
  ele.style.transition = "opacity " + duration + " ease-in-out";
  ele.style.opacity = "1";
  const timeout = parseFloat(duration) * 1000;
  setTimeout(() => {
    ele.style.transition = "";
  }, timeout);
}