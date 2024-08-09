import '../styles/MainAppLayout.css';
import React, { useEffect, useState } from 'react';
import { IApiStatus, IDimensions } from '../interfaces';
import { MainAppLayout } from './_MainAppLayout';
import { ApiUnavailableLayout } from './_ApiUnavailableLayout';
import { calculateDrawingDimensions } from '../functions';
import { useDebounce } from '../hooks';
import { LayoutsProps } from '../interfaces/_LayoutsProps';
import { StuckSketchLayout } from './_StuckSketchLayout';

interface RootLayoutProps {
  apiStatus: IApiStatus;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ apiStatus }) => {
  const [dimensions, setDimensions] = useState<IDimensions>(calculateDrawingDimensions(window))

  const handleResizeDebounces = useDebounce(() => {
    setDimensions(calculateDrawingDimensions(window));
  }, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResizeDebounces);

    return () => {
      window.removeEventListener('resize', handleResizeDebounces);
    };
  }, [handleResizeDebounces]);

  const props = (): LayoutsProps => ({ apiStatus, dimensions });
  return (
    <>
      <h1 id='site-title-text-main'>wikiverse</h1>
      <div id='site-title-stack'>
        <h4 id='site-title-stack-1'>wikiverse</h4>
        <h4 id='site-title-stack-2'>wikiverse</h4>
        <h4 id='site-title-stack-3'>wikiverse</h4>
        <h4 id='site-title-stack-4'>wikiverse</h4>
        <h4 id='site-title-stack-5'>wikiverse</h4>
        <h4 id='site-title-stack-6'>wikiverse</h4>
      </div>
      <StuckSketchLayout {...props()} />
      {/* {apiStatus.code != 500 ? <MainAppLayout {...props()} /> : <ApiUnavailableLayout {...props()} />} */}
    </>
  );
};