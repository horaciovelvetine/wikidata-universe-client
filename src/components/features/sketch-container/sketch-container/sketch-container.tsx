import "./sketch-container.css";
import { Dispatch, SetStateAction } from "react";

import { P5Sketch } from "../../../../types";
import { SketchTutorial, WikiverseSketch } from "..";
import { WikiverseServiceResponse } from "../../../../contexts";

export interface SketchContainerProps {
  initSketchData: WikiverseServiceResponse;
  setSketchRef: Dispatch<SetStateAction<P5Sketch | null>>;
  isTutorialSketch: boolean;
}

export const SketchContainer = ({
  initSketchData,
  setSketchRef,
  isTutorialSketch,
}: SketchContainerProps) => {
  return isTutorialSketch ? (
    <SketchTutorial {...{ initSketchData, setSketchRef, isTutorialSketch }} />
  ) : (
    <WikiverseSketch {...{ initSketchData, setSketchRef, isTutorialSketch }} />
  );
};
