import '../styles/MainAppLayout.css';
import React, { useEffect, useState } from 'react';
import { IApiStatus, IDimensions } from '../interfaces';
import { MainAppLayout } from './_MainAppLayout';
import { ApiUnavailableLayout } from './_ApiUnavailableLayout';
import { calculateDrawingDimensions } from '../functions';
import { useDebounce } from '../hooks';
import { LayoutsProps } from '../interfaces/_LayoutsProps';

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
      {apiStatus.status != 500 ? <MainAppLayout {...props()} /> : <ApiUnavailableLayout {...props()} />}
    </>
  );
};