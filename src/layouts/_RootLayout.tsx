import '../assets/styles/components/WikidataUniverseAppMain.css';
import React from 'react';
import { IApiStatusResponse } from '../interfaces';
import { MainAppLayout } from './_MainAppLayout';

interface RootLayoutProps {
  apiStatus: IApiStatusResponse;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ apiStatus }) => {
  return (
    <>
      {apiStatus.status != 500 ?
        <MainAppLayout apiStatus={apiStatus} />
        :
        <p>here I am</p>
      }
    </>
  );
};