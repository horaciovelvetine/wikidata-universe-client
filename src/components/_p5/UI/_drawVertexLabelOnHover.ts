import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { Vertex } from "..";
import { Camera, Font } from "p5";

// The way that text & p5.js intertact when using WEBGL leaves a bit to be desired
// (another) Thank you to @camelCaseSensitive on {github} & @morejpeg on {youtube}
// Excellent tutorial for this approach ==> (https://www.youtube.com/watch?v=kJMx0F7e9QU)
// HUD Works around flickering caused by state changes above the p5.js instance
export function drawVertexLabelOnHover(p5: P5CanvasInstance<SketchProps>, hoveredVert: Vertex | undefined, cam: Camera, font: Font) {
  if (hoveredVert) {
    const pan = p5.atan2(cam.eyeZ - cam.centerZ, cam.eyeX - cam.centerX);
    const tilt = p5.atan2(cam.eyeY - cam.centerY, p5.dist(cam.eyeX, cam.eyeZ, cam.centerX, cam.centerZ));

    p5.push();
    p5.translate(hoveredVert.coordinates.x, hoveredVert.coordinates.y, hoveredVert.coordinates.z);
    
    p5.rotateY(-pan);
    p5.rotateZ(tilt + p5.PI);
    p5.rotateY(-p5.PI / 2);
    p5.rotateZ(p5.PI);

    p5.textSize(4.5);
    p5.fill('rgba(245, 245, 245, 0.75)');
    p5.textFont(font);
    p5.textAlign(p5.CENTER, p5.CENTER);
    const verticalOffset = -(hoveredVert.label.length);
    p5.translate(0, verticalOffset, 0); // adjusts for position on 'screen'
    p5.text(hoveredVert.label, 0, 0)
    p5.pop();
  }
}