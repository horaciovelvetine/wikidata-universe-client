import '../styles/animations/HorizontalShake.css'

export function shakeElement(ele: HTMLElement) {
  ele.style.animation = "horizontal-shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
  ele.style.borderColor = "var(--danger)";
  setTimeout(() => {
    ele.style.animation = "";
    ele.style.borderColor = "";
  }, 820);
}