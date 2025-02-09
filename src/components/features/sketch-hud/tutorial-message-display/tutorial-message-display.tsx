import "./tutorial-message-display.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Close } from "../../../../assets/icons";

import { P5Sketch, TutorialSketch } from "../../../../types";
import { useWikiverseService } from "../../../../contexts";

interface TutorialMessageDisplayProps {
  sketchRef: P5Sketch; //==> Extended type of TutorialSketch
  setIsTutorialSketch: Dispatch<SetStateAction<boolean>>;
}

const ID = (sufx: string) => `tutorial-message-${sufx}`;

export const TutorialMessageDisplay = ({
  sketchRef,
  setIsTutorialSketch,
}: TutorialMessageDisplayProps) => {
  const tutorialSketchRef = sketchRef as TutorialSketch; // conditional boolean in HUD narrows this
  const { getTutorial } = useWikiverseService();
  const [bodyMsg, setBodyMsg] = useState(
    tutorialSketchRef.state.tutorialBody()
  );
  const [instruction, setInstruction] = useState(
    tutorialSketchRef.state.tutorialInstruction()
  );

  useEffect(() => {
    // tell sketch how to update react's display of tutorial messag-ing
    tutorialSketchRef.state.addTutorialBodySubscriber(setBodyMsg);
    tutorialSketchRef.state.addTutorialInstructionSubscriber(setInstruction);
  }, []);

  const handleAdvanceTutorialClick = async () => {
    const res = await getTutorial(
      tutorialSketchRef.getNextSlideNumber().toString()
    );
    tutorialSketchRef.state.updateTutorialState(res);
  };

  const handleReverseTutorialClick = async () => {
    const res = await getTutorial(
      tutorialSketchRef.getPrevSlideNumber().toString()
    );
    tutorialSketchRef.state.updateTutorialState(res);
  };

  const handleExitTutorialClick = () => {
    setIsTutorialSketch(prev => !prev);
    // clean up to home page, remove sketchRef and restart that process
    // needs to show the landing page input
    // clean up the input and hide top screen (title etc)
  };

  return (
    <div id={ID("container")}>
      <div id={ID("layout")}>
        <div id={ID("exit-container")}>
          <img
            id={ID("close-icon")}
            src={Close}
            onClick={handleExitTutorialClick}
          />
        </div>
        <p id={ID("body")}>{bodyMsg}</p>
        <div id={ID("forward-back-container")}>
          <img
            id={ID("back-icon")}
            src={ArrowLeft}
            onClick={handleReverseTutorialClick}
          />
          <p>{instruction}</p>
          <img
            id={ID("forward-icon")}
            src={ArrowRight}
            onClick={handleAdvanceTutorialClick}
          />
        </div>
      </div>
    </div>
  );
};
