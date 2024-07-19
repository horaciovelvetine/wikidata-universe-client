import React from 'react';
import settingsIcon from '../assets/img/mi-settings-icon.svg';

interface ISettingsAdjusterProps {
  // Define your component props here
}

export const SettingsAdjuster: React.FC<ISettingsAdjusterProps> = ({ }) => {
  return (
    <>
      <img src={settingsIcon} />
    </>
  );
};