import "./footer.css";
import { Dispatch, SetStateAction } from "react";

import { WikiverseServiceResponse, useWikiverseService } from "../../contexts";
import { _bl, BACKEND_URL, FRONTEND_URL, GITHUB_URL } from "../../app";
import { useComponentID } from "../../hooks";

interface FooterProps {
  setIsTutorialSketch: Dispatch<SetStateAction<boolean>>;
  setInitSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

export const Footer = ({
  setIsTutorialSketch,
  setInitSketchData,
}: FooterProps) => {
  const { ID } = useComponentID("footer");
  const { getTutorial } = useWikiverseService();

  const handleTutorialClick = async () => {
    debugger; // stop tutorial execution for now
    setIsTutorialSketch(prev => !prev);
    const res = await getTutorial("1");
    setInitSketchData(res);
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
