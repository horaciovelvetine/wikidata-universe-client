import "./footer.css";
import { Dispatch, SetStateAction } from "react";

import { _bl, BACKEND_URL, FRONTEND_URL, GITHUB_URL } from "../../app";
import { useComponentID } from "../../hooks";
import { WikiverseServiceResponse } from "../../types";

interface FooterProps {
  setIsTutorialSketch: Dispatch<SetStateAction<boolean>>;
  setSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}
/**
 * Container positioned directly under the #main-display with links and the ability for the user to initiate the {@link TutorialSketch}
 *
 * @component
 * @param {setIsTutorialSketch} props.setIsTutorialSketch - state setting dispatcher which is used to trigger the tutorial version of the Sketch for the user
 * @param {setSketchData} props.setSketchData - sketch initializing setter called when starting up a tutorial sketch
 *
 */
export const Footer = () => {
  const { ID } = useComponentID("footer");

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
      </ul>
    </footer>
  );
};
