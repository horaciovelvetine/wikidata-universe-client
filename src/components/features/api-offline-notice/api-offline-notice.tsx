import './api-offline-notice.css'
import { createRef, useEffect } from 'react';

import { Exclaims, Question } from '../../../assets/icons';
import { useWikiverseService } from '../../../contexts';

const ID = (sufx: string) => `offline-notice-${sufx}`;

export const ApiOfflineNotice = () => {
  const { isOnline } = useWikiverseService();
  const containerRef = createRef<HTMLDivElement>()

  useEffect(() => {
    if (!containerRef.current) return;
    if (isOnline) {
      containerRef.current.style.opacity = '0';
    } else {
      containerRef.current.style.opacity = '100';
    }
  }, [isOnline, containerRef])

  return (
    <div id={ID('container')} ref={containerRef}>
      <div id={ID('text-container')}>
        <h1>the Wikiverse is offline.</h1>
        <h3>refresh the page or try again later.</h3>
      </div>
      <div id={ID('img-container')}>
        <img src={Question} id={ID('question-icon')} />
        <img src={Exclaims} id={ID('exclaims-icon')} />
      </div>
    </div>
  )
}