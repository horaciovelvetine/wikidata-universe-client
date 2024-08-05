import '../assets/styles/MainAppLayout.css';
import React from 'react';
import { IApiStatusResponse } from '../interfaces';
import { MainAppLayout } from './_MainAppLayout';
import ApiUnavailableLayout from './_ApiUnavailableLayout';

interface RootLayoutProps {
  apiStatus: IApiStatusResponse;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ apiStatus }) => {
  return (
    <>
      {apiStatus.status != 500 ?
        <MainAppLayout apiStatus={apiStatus} />
        :
        <ApiUnavailableLayout />
      }
    </>
  );
};