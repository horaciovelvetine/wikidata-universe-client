import './SessionSettingsMenu.css'
import { Settings as SettingsIcon } from '../../assets/icons';

import { createRef, FC, useEffect, } from 'react';

import { SessionSettingsState } from '../../interfaces'
import { SessionSettingsToggleOption } from './SessionSettingsToggleOption';
import { toggleElementOpacity, toggleDisplayVisibility, changeFocusOpacity } from '..';

interface SessionSettingsProps {
  sessionSettingsState: SessionSettingsState;
}

export const SessionSettings: FC<SessionSettingsProps> = ({ sessionSettingsState }) => {
  const { showSettings, setShowSettings, showDebugDetails, setShowDebugDetails, showUnfetchedVertices, setShowUnfetchedVertices, showMedianAxis, setShowMedianAxis, showMedianBoundBox, setShowMedianBoundBox, showDimensionBoundBox, setShowDimensionBoundBox } = sessionSettingsState;

  const menuContainerRef = createRef<HTMLDivElement>();
  const iconRef = createRef<HTMLImageElement>();

  useEffect(() => {
    toggleElementOpacity(menuContainerRef.current!, showSettings);
    toggleDisplayVisibility(menuContainerRef.current!, showSettings, 'grid')
    changeFocusOpacity(iconRef.current!, showSettings, '0.25s', '60%')
  }, [showSettings])

  const allToggleSettings = [
    { key: showDebugDetails, action: setShowDebugDetails, label: "Debug Details", shortcut: "," },
    { key: showUnfetchedVertices, action: setShowUnfetchedVertices, label: "Unfetched Vertices", shortcut: "." },
    { key: showMedianAxis, action: setShowMedianAxis, label: "Median Orientation Axis", shortcut: null },
    { key: showMedianBoundBox, action: setShowMedianBoundBox, label: "Median Bounding Box", shortcut: null },
    { key: showDimensionBoundBox, action: setShowDimensionBoundBox, label: "Dimension Bounding Box", shortcut: null }
  ]

  return (
    <div id='session-settings-container' onClick={(e) => { e.stopPropagation() }}>
      <img id='session-settings-icon' src={SettingsIcon} alt='gear to toggle displaying current settings menu' onClick={() => setShowSettings(prev => !prev)} ref={iconRef} />
      <div id='session-settings-menu-container' ref={menuContainerRef}>
        <h3 id='session-settings-menu-header'>Settings</h3>
        {allToggleSettings.map((setting, index) => (
          <SessionSettingsToggleOption
            key={index}
            isEnabled={setting.key}
            onToggle={setting.action}
            label={setting.label}
            shortcut={setting.shortcut}
          />
        ))}
      </div>
    </div>
  );
};
