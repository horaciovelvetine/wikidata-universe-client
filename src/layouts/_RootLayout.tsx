import '../styles/MainAppLayout.css';
import React from 'react';
import { IApiStatus } from '../interfaces';
import { MainAppLayout } from './_MainAppLayout';
import { ApiUnavailableLayout } from './_ApiUnavailableLayout';

interface RootLayoutProps {
  apiStatus: IApiStatus;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ apiStatus }) => {
  return (
    <>
      {apiStatus.status != 500 ? <MainAppLayout apiStatus={apiStatus} /> : <ApiUnavailableLayout apiStatus={apiStatus} />}
    </>
  );
};