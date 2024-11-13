export function calcSafeSketchWindowSize() {
  return { width: Math.round(window.innerWidth * 0.8), height: Math.round(window.innerHeight * 0.85) }
}