export function flashNoneSelectedMsg(msg: HTMLElement, duration: number = 500) {
  msg.style.transition = `opacity ${(duration / 2)}ms linear`;
  msg.style.opacity = '1';
  setTimeout(() => {
    msg.style.opacity = '0';
  }, duration);
}