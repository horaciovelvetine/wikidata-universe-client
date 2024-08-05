import '../assets/styles/ApiUnavailableLayout.css'

import { ErrorSketch } from '../components';
import React, { memo, useEffect } from 'react';
import { fadeInElement } from '../functions';

const MemoizedSketch = memo(ErrorSketch);

const ApiUnavailableLayout: React.FC = () => {
  const containerRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!);
    }, 1);
  }, []);

  return (
    <>
      <div id='error-message-container' ref={containerRef}>
        <h1>API Unavailable</h1>
        <p>Sorry, the API is currently unavailable. Please try again later.</p>
      </div>
      <div id='sketch-layout-container'>
        <MemoizedSketch />
      </div>
    </>
  );
};

export default ApiUnavailableLayout;