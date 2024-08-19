export function shakeInvalidElement(ele: HTMLElement) {
  ele.style.animation = "horizontal-shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
  ele.style.borderColor = "rgb(var(--danger))";
  ele.style.color = "rgb(var(--danger))";
  ele.style.transition = "border-color 0.82s, color 0.82s";
  setTimeout(() => {
    ele.style.animation = "";
    ele.style.transition = "border-color 0.82s, color 0.82s";
    ele.style.borderColor = "rgb(var(--font))";
    ele.style.color = "rgb(var(--font))";
  }, 820);
}