import './ApiOfflineNoticeStyle.css'


import { createRef, useEffect } from "react";

import { Exclaims, Question } from "../../assets/icons";
import GlobeLogo from '../../assets/imgs/globe-outline-no-bg-white.svg'

import { RequestResponse } from '../../interfaces';
import { toggleElementOpacity } from '../';

interface ApiOfflineProps {
  apiStatusResponse: RequestResponse;
}

export const ApiOfflineNotice: React.FC<ApiOfflineProps> = ({ apiStatusResponse }) => {

  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    toggleElementOpacity(containerRef.current!, true, '250ms');
  }, []);

  return (
    <>
      <div id='error-message-container' ref={containerRef}>
        <div id='error-text-container'>
          <h1 id='error-title'>{apiStatusResponse.status} Unavailable</h1>
          <p id='error-message'>{apiStatusResponse.errMsg}</p>
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