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

/**
 * Main container element for the @see P5Sketch which draws the primary visuals for the application. Prevents rendering when there
 * is no data and selectively renders the correct sub-type of Sketch based on what the client selects.
 *
 * @param {WikiverseServiceResponse | null} props.sketchData - can be null to return empty default element, otherwise initial data used to build a sketch
 * @param {SetStateAction} props.setSketchRef - setter to allow react visibility into the active sketch once it is created
 * @param {boolean} props.isTutorialSketch - used to select the sub-type of @see P5Sketch instead using the @see TutorialSketch
 */
export const SketchContainer = ({
  sketchData,
  setSketchRef,
  isTutorialSketch,
}: SketchProps): JSX.Element => {
  const props = { sketchData, setSketchRef, isTutorialSketch };

  // Defaults to the empty el when there is no sketchData present
  // Else checks if this is meant to be a Tutorial or not
  return sketchData ? (
    isTutorialSketch ? (
      <SketchTutorial {...props} />
    ) : (
      <WikiverseSketch {...props} />
    )
  ) : (
    <></>
  );
};
