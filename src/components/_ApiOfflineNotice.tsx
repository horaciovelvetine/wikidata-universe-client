import { createRef, useEffect } from "react";

import { Exclaims, Question } from "../assets/icons";
import GlobeLogo from '../assets/imgs/globe-outline-no-bg-white.svg'





export const ApiOfflineNotice: React.FC = () => {

  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!);
    }, 1);
  }, []);

  return (
    <>
      <div id='error-message-container' ref={containerRef}>
        <div id='error-text-container'>
          <h1 id='error-title'>{404} API Unavailable</h1>
          <p id='error-message'>Sorry, the API is currently unavailable. Please try again later.</p>
        </div>
        <div id='unavailable-glogo-container'>
          <img src={GlobeLogo} alt="Wikipedia globe logo" id="unavailable-glogo" />
        </div>
        <img src={Question} alt="Big ol' question mark" id="question-mark-icon" />
        <img src={Exclaims} alt="Big ol' exclamation point (this error must be a problem)" id='exclamation-mark-icon' />
      </div>
    </>
  );
};