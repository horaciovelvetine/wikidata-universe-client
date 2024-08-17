import './WikiverseAppStyle.css';
import React from 'react';
import { ApiStatus } from '../interfaces';
import { WikiverseSketch } from '../p5/WikiverseSketch';
import { VerticalSiteTitle, Footer } from '../components';

interface WikiverseAppProps {
  apiStatusRes: ApiStatus;
}

export const WikiverseApp: React.FC<WikiverseAppProps> = ({ apiStatusRes }) => {

  return (
    <>
      <VerticalSiteTitle />
      <WikiverseSketch session={{ query: undefined }} />
      <Footer />
    </>
  );
};
