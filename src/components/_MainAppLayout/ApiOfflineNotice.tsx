import './ApiOfflineNotice.css'
import { Exclaims, Question } from "../../assets/icons";
import GlobeLogo from '../../assets/imgs/globe-outline-no-bg-white.svg'

import { createRef, useEffect } from "react";

import { RequestResponse } from '../../interfaces';
import { toggleElementOpacity } from '../';

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
  }, []);

  return (
    <>
      <div id={prfx('cont')} ref={containerRef}>
        <div id={prfx('text-cont')}>
          <h1 id={prfx('title')}>{apiStatusResponse.status} Unavailable</h1>
          <p id={prfx('notice-msg')}>{apiStatusResponse.errMsg}</p>
        </div>
        <div id={prfx('globe-cont')}>
          <img src={GlobeLogo} alt="Wikipedia globe logo" id={prfx('globe-logo')} />
        </div>
        <img src={Question} alt="Big ol' question mark" id={prfx('question-icon')} />
        <img src={Exclaims} alt="Big ol' exclamation point (this error must be a problem)" id={prfx('exclaims-icon')} />
      </div>
    </>
  );
};