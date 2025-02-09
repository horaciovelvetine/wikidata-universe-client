import './sketch-container.css'
import { Dispatch, FC, SetStateAction } from "react";

import { P5Sketch } from "../../../../types";
import { WikiverseServiceResponse } from '../../../../app';
import { SketchTutorial, WikiverseSketch } from '..';

export interface SketchContainerProps {
  initSketchData: WikiverseServiceResponse;
  setSketchRef: Dispatch<SetStateAction<P5Sketch | null>>;
  isTutorialSketch: boolean;
}

export const SketchContainer: FC<SketchContainerProps> = ({ initSketchData, setSketchRef, isTutorialSketch }) => {
  return (
    isTutorialSketch ?
      <SketchTutorial {...{ initSketchData, setSketchRef, isTutorialSketch }} /> :
      <WikiverseSketch {... { initSketchData, setSketchRef, isTutorialSketch }} />
  )
}