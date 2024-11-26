import './ApiOfflineNotice.css'
import { Exclaims, Question } from "../../assets/icons";
import GlobeLogo from '../../assets/imgs/globe-outline-no-bg-white.svg'

import { createRef, useEffect } from "react";
import { toggleElementOpacity } from '..';
import { RequestResponse } from '../../api';

interface ApiOfflineProps {
  apiStatusResponse: RequestResponse;
}

const prfx = (sufx: string) => {
  return 'api-offline-notice-' + sufx;
}

export const ApiOfflineNotice: React.FC<ApiOfflineProps> = ({ apiStatusResponse }) => {

  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      toggleElementOpacity(containerRef.current!, true, '400ms');
    }, 1)
  });

  return (
    <>
      <div id={prfx('cont')} ref={containerRef}>
        <div id={prfx('text-cont')}>
          <h1 id={prfx('title')}>{apiStatusResponse.status} Unavailable</h1>
          <p id={prfx('body')}>The API is currently offline, refresh the page or try again later.</p>
        </div>
        <div id={prfx('globe-cont')}>
          <img src={GlobeLogo} id={prfx('globe-logo')} />
        </div>
        <img src={Question} id={prfx('question-icon')} />
        <img src={Exclaims} id={prfx('exclaims-icon')} />
      </div>
    </>
  );
};