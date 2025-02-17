import "./sketch-container.css";
import { Dispatch, SetStateAction } from "react";

import { P5Sketch, WikiverseServiceResponse } from "../../../types";
import { SketchTutorial } from "../sketch-tutorial/sketch-tutorial";
import { WikiverseSketch } from "../wikiverse-sketch/wikiverse-sketch";

export interface SketchProps {
  sketchData: WikiverseServiceResponse | null;
  setSketchRef: Dispatch<SetStateAction<P5Sketch | null>>;
  isTutorialSketch: boolean;
}

export const SketchContainer = ({
  sketchData,
  setSketchRef,
  isTutorialSketch,
}: SketchProps): JSX.Element => {
  const Sketch = () => {
    return isTutorialSketch ? (
      <SketchTutorial {...{ sketchData, setSketchRef, isTutorialSketch }} />
    ) : (
      <WikiverseSketch
        {...{ sketchData, setSketchRef, isTutorialSketch }}
      />
    );
  };
  return !sketchData ? <></> : Sketch();
};
