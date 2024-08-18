export function flashNoneSelectedMsg(msg: HTMLElement, duration: number = 500) {
  const transition = `opacity ${(duration / 2)}ms linear`;
  msg.style.transition = transition;
  msg.style.opacity = '1';
  setTimeout(() => {
    msg.style.transition = transition;
    msg.style.opacity = '0';
  }, duration);
}