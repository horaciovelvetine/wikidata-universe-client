import './ApiOfflineNoticeStyle.css'
import '../animations/_SlowGlobeRotation.css'

import { createRef, useEffect } from "react";

import { Exclaims, Question } from "../../assets/icons";
import GlobeLogo from '../../assets/imgs/globe-outline-no-bg-white.svg'

import { showHideElement } from "../animations";
import { RequestResponse } from '../../interfaces';

interface ApiOfflineProps {
  apiStatus: RequestResponse;
}

export const ApiOfflineNotice: React.FC<ApiOfflineProps> = ({ apiStatus }) => {

  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      showHideElement(containerRef.current!, true);
    }, 1);
  }, []);

  return (
    <>
      <div id='error-message-container' ref={containerRef}>
        <div id='error-text-container'>
          <h1 id='error-title'>{apiStatus.status} Unavailable</h1>
          <p id='error-message'>{apiStatus.errMsg}</p>
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