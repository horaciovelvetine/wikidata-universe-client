import '../styles/ApiUnavailableLayout.css'

import { ErrorSketch } from '../components';
import React, { memo, useEffect } from 'react';
import { fadeInElement } from '../functions';
import GlobeLogo from '../assets/img/globe-outline-no-bg-white.svg';
import QuestionIcon from '../assets/img/mi-question-icon.svg'
import ExclaimIcon from '../assets/img/mi-exclaim-icon.svg'
import { IApiStatus } from '../interfaces';

const MemoizedSketch = memo(ErrorSketch);

interface ApiUnavailableLayoutProps {
  apiStatus: IApiStatus;
}

export const ApiUnavailableLayout: React.FC<ApiUnavailableLayoutProps> = ({ apiStatus }) => {
  const containerRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!);
    }, 1);
  }, []);

  return (
    <>
      <div id='error-message-container' ref={containerRef}>
        <div id='error-text-container'>
          <h1 id='error-title'>{apiStatus.status} API Unavailable</h1>
          <p id='error-message'>Sorry, the API is currently unavailable. Please try again later.</p>
        </div>
        <img src={GlobeLogo} alt="Wikipedia globe logo" id="unavailable-glogo" />
        <img src={QuestionIcon} alt="Big ol' question mark" id="question-mark-icon" />
        <img src={ExclaimIcon} alt="Big ol' exclamation point (this error must be a problem)" id='exclamation-mark-icon' />
      </div>
      <div id='sketch-layout-container'>
        <MemoizedSketch />
      </div>
    </>
  );
};