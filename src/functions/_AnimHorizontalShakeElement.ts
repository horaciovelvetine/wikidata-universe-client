import '../styles/animations/HorizontalShake.css'

export function shakeElement(ele: HTMLElement) {
  ele.style.animation = "horizontal-shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
  ele.style.borderColor = "rgb(var(--danger))";
  ele.style.color = "rgb(var(--danger))";
  setTimeout(() => {
    ele.style.animation = "";
    ele.style.borderColor = "";
    ele.style.color = "";
  }, 820);
}