/**
 * Fades out the given HTML element by transitioning its opacity to 0 and then sets its display to 'none'.
 * 
 * @param ele - The HTML element to be faded out and hidden.
 * @param duration - The duration of the fade-out transition. Defaults to '350ms'. Can be specified in milliseconds (e.g., '350ms') or seconds (e.g., '0.35s').
 */
export function fadeElementAndRemoveDisplay(ele: HTMLElement, duration: string = '350ms') {
  ele.style.transition = `opacity ${duration} ease-in-out`;
  ele.style.opacity = '0';

  const durationInMs = duration.endsWith('ms')
    ? parseInt(duration)
    : parseFloat(duration) * 1000;

  setTimeout(() => {
    ele.style.display = 'none';
  }, durationInMs);
}