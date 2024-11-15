export function calcSafeSketchWindowSize() {
  const width = Math.max(Math.round(window.innerWidth * 0.8), 1280);
  const height = Math.max(Math.round(window.innerHeight * 0.85), 800);
  return { width, height };
}