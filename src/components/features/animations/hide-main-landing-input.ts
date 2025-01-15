/**
 * @method hideMainLandingInput() - hide the main input overlay after a successful response from the API signaling the start of exploring a new Query Sketch by the user.
 */
export function hideMainLandingInput(container: HTMLDivElement) {
  container.style.opacity = '0';
  setTimeout(() => {
    container.style.display = 'none';
  }, 235)
}