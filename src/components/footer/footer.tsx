import "./footer.css";
import { Dispatch, SetStateAction } from "react";

import { useWikiverseService } from "../../providers";
import { _bl, BACKEND_URL, FRONTEND_URL, GITHUB_URL } from "../../app";
import { useComponentID } from "../../hooks";
import { WikiverseServiceResponse } from "../../types";

interface FooterProps {
  setIsTutorialSketch: Dispatch<SetStateAction<boolean>>;
  setSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}
/**
 * Contains all content always positioned directly under the @component SketchContainer in Grid position 8 (CSS)
 *
 * @param {setIsTutorialSketch} props.setIsTutorialSketch - state setting dispatcher which is used to trigger the tutorial version of the Sketch for the user
 * @param {setSketchData} props.setSketchData - sketch initializing setter called when starting up a tutorial sketch
 */
export const Footer = ({ setIsTutorialSketch, setSketchData }: FooterProps) => {
  const { ID } = useComponentID("footer");
  const { getTutorialStep } = useWikiverseService();

  const handleTutorialClick = async () => {
    debugger; // stop tutorial execution for now
    setIsTutorialSketch(prev => !prev);
    const res = await getTutorialStep("1");
    setSketchData(res);
  };

  return (
    <footer id={ID("main")}>
      <ul id={ID("contents-list")}>
        <li className="footer-list-content" id={ID("repo-links")}>
          <a href={FRONTEND_URL} target={_bl}>
            frontend
          </a>{" "}
          /{" "}
          <a href={BACKEND_URL} target={_bl}>
            backend
          </a>
        </li>
        <li className="footer-list-content" id={ID("copy-statement")}>
          ©2024 by{" "}
          <a href={GITHUB_URL} target={_bl}>
            {" "}
            @horaciovelvetine
          </a>
        </li>
        <li className="footer-list-content" id={ID("tutorial-container")}>
          <a id={ID("tutorial-link")} onClick={handleTutorialClick}>
            Click
          </a>{" "}
          for a tutorial
        </li>
      </ul>
    </footer>
  );
};
