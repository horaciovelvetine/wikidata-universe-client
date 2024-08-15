import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { drawAxisGiz, drawBoundBoxGiz, drawCamPosGiz, drawFocalLineGiz } from ".";
import { Camera } from "p5";

export function drawUIToggleable(p5: P5CanvasInstance<SketchProps>, params: any, obsCam: Camera, cam: Camera) {
  // TOGGLES
  if (params.displayBoundingBox) {
    drawBoundBoxGiz(p5);
  }
  if (params.displayAxis) {
    drawAxisGiz(p5);
  }

  if (params.useObsCam) {
    obsCam.lookAt(cam.eyeX, cam.eyeY, cam.eyeZ)
  }

  if (params.drawObsCamGiz) {
    if (!params.useObsCam) {
      drawCamPosGiz(p5, obsCam, 1);
    }
  }

  if (params.drawCamGiz) {
    if (params.useObsCam) {
      drawCamPosGiz(p5, cam, 2);
    }
  }

  if (params.drawCamFocalGiz) {
    if (params.useObsCam) {
      drawFocalLineGiz(p5, cam);
    }
  }

  if (params.drawObsCamFocalGiz) {
    if (!params.useObsCam) {
      drawFocalLineGiz(p5, obsCam);
    }
  }
}