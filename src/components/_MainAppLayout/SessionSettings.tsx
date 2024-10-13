import './SessionSettingsStyle.css'

import React, { createRef, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import { Settings as SettingsIcon } from '../../assets/icons';
import { SessionSettingsState } from '../../interfaces/'
import { changeFocusOpacity, showHideElement, toggleDisplayVisibility } from '../animations';

export const SessionSettings: FC<SessionSettingsState> = ({ showDebugDetails, setShowDebugDetails, showUnfetchedVertices, setShowUnfetchedVertices, showMedianAxis, setShowMedianAxis, showMedianBoundBox, setShowDimensionBoundBox, showDimensionBoundBox, setShowMedianBoundBox }) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuContainerRef = createRef<HTMLDivElement>();
  const iconRef = createRef<HTMLImageElement>();

  useEffect(() => {
    showHideElement(menuContainerRef.current!, showMenu)
    toggleDisplayVisibility(menuContainerRef.current!, showMenu, 'grid')
    changeFocusOpacity(iconRef.current!, showMenu, '0.25s', '60%')
  }, [showMenu])

  const showHideLabel = (show: boolean) => {
    return !show ? " (show)" : " (hide)" ;
  }

  return (
    <div id='session-settings-container'>
      <img id='session-settings-icon' src={SettingsIcon} alt='gear to toggle displaying current settings menu' onClick={() => setShowMenu(prev => !prev)} ref={iconRef} />
      <div id='session-settings-menu-container' ref={menuContainerRef}>
        <h3 id='session-settings-menu-header'>Settings:</h3>
        <label>
          <input
            type="checkbox"
            checked={showDebugDetails}
            onChange={() => setShowDebugDetails(prev => !prev)}
          />
          {showHideLabel(showDebugDetails)} Debug Details
        </label>
        <label>
          <input
            type="checkbox"
            checked={showUnfetchedVertices}
            onChange={() => setShowUnfetchedVertices(prev => !prev)}
          />
          {showHideLabel(showUnfetchedVertices)} Unfetched Vertices
        </label>
        <label>
          <input
            type="checkbox"
            checked={showMedianAxis}
            onChange={() => setShowMedianAxis(prev => !prev)}
          />
          {showHideLabel(showMedianAxis)} Median Axis
        </label>
        <label>
          <input
            type="checkbox"
            checked={showMedianBoundBox}
            onChange={() => setShowMedianBoundBox(prev => !prev)}
          />
          {showHideLabel(showMedianBoundBox)} Median Bound Box
        </label>
        <label>
          <input
            type="checkbox"
            checked={showDimensionBoundBox}
            onChange={() => setShowDimensionBoundBox(prev => !prev)}
          />
          {showHideLabel(showDimensionBoundBox)} Dimension Bound Box
        </label>
      </div>
    </div>
  );
};
