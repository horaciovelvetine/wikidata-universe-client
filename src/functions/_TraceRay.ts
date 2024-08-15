import { multiply, inv } from "mathjs";
import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { Camera } from "p5";
import { Vertex } from "../_p5";

// Credit to @camelCaseSensitive on {github} & @morejpeg on {youtube}
// For the original code, npm package, and tutorial on so many things p5.js
// Adapted slightly for React/TS and use outside of a p5.js sketch instance
// https://github.com/camelCaseSensitive/p5-raycast/blob/main/p5-raycast.js
export function traceRay(p5: P5CanvasInstance<SketchProps>, cam: Camera, vert: Vertex) {
  const ndcX = (p5.mouseX - p5.width / 2) / p5.width * 2;
  const ndcY = (p5.mouseY - p5.height / 2) / p5.height * 2;
  const ndcVect = [ndcX, -ndcY, 1, 1];

  // Dig into the p5.js instance to get the projection matrix && copy it to a new mat4
  // not an a value intended to be accessed in/by p5.js API - a needed workaround here. 
  let p5RenDERworkaround = p5 as any;
  const p5ProjMat = p5RenDERworkaround._renderer.uPMatrix.mat4;
  const projMat = [
    [p5ProjMat[0], p5ProjMat[1], p5ProjMat[2], p5ProjMat[3]],
    [p5ProjMat[4], p5ProjMat[5], p5ProjMat[6], p5ProjMat[7]],
    [p5ProjMat[8], p5ProjMat[9], p5ProjMat[10], p5ProjMat[11]],
    [p5ProjMat[12], p5ProjMat[13], p5ProjMat[14], p5ProjMat[15]]
  ];
  const camVec = multiply(ndcVect, inv(projMat));

  // same workaround as above for access to renderer...
  const p5ModMat = p5RenDERworkaround._renderer.uMVMatrix.mat4;
  const modMat = [
    [p5ModMat[0], p5ModMat[1], p5ModMat[2], p5ModMat[3]],
    [p5ModMat[4], p5ModMat[5], p5ModMat[6], p5ModMat[7]],
    [p5ModMat[8], p5ModMat[9], p5ModMat[10], p5ModMat[11]],
    [p5ModMat[12], p5ModMat[13], p5ModMat[14], p5ModMat[15]]
  ];

  const worldMat = multiply(camVec, inv(modMat));
  const perspDiv = camVec[3];
  const worldVec = [worldMat[0] / perspDiv, worldMat[1] / perspDiv, worldMat[2] / perspDiv];
  const rayLength = p5.dist(cam.eyeX, cam.eyeY, cam.eyeZ, vert.coordinates.x, vert.coordinates.y, vert.coordinates.z);
  const phi = p5.atan2(worldVec[1] - cam.eyeY, p5.dist(worldVec[0], worldVec[2], cam.eyeX, cam.eyeZ));
  const theta = -p5.atan2(worldVec[0] - cam.eyeX, worldVec[2] - cam.eyeZ) + p5.PI / 2;
  const xVec = cam.eyeX + rayLength * p5.cos(phi) * p5.cos(theta);
  const yVec = cam.eyeY + rayLength * p5.sin(phi);
  const zVec = cam.eyeZ + rayLength * p5.cos(phi) * p5.sin(theta);
  const distFromVert = p5.dist(vert.coordinates.x, vert.coordinates.y, vert.coordinates.z, xVec, yVec, zVec);

  console.log({ xVec, yVec, zVec, distFromVert })

  if (distFromVert < vert.radius) {
    return [xVec, yVec, zVec];
  }
  return false;
}