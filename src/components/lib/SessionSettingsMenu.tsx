import './SessionSettingsMenu.css'
import { Settings as SettingsIcon } from '../../assets/icons';

import { createRef, Dispatch, FC, SetStateAction, useEffect, } from 'react';

import { SessionSettingsState } from '../../interfaces'
import { toggleElementOpacity, toggleDisplayVisibility, changeFocusOpacity } from '..';

interface SessionSettingsMenuProps {
  sessionSettingsState: SessionSettingsState;
}

interface SessionSettingsToggleOptionProps {
  isEnabled: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
  label: string;
  shortcut: string | null;
}

export const SessionSettingsMenu: FC<SessionSettingsMenuProps> = ({ sessionSettingsState }) => {
  const { showSettings, setShowSettings,
    showDebugDetails, setShowDebugDetails,
    showUnfetchedVertices, setShowUnfetchedVertices,
    showMedianAxis, setShowMedianAxis,
    showMedianBoundBox, setShowMedianBoundBox,
    showDimensionBoundBox, setShowDimensionBoundBox,
    useOfflineData, setUseOfflineData
  } = sessionSettingsState;

  const menuContainerRef = createRef<HTMLDivElement>();
  const iconRef = createRef<HTMLImageElement>();

  useEffect(() => {
    toggleElementOpacity(menuContainerRef.current!, showSettings);
    toggleDisplayVisibility(menuContainerRef.current!, showSettings, 'grid')
    changeFocusOpacity(iconRef.current!, showSettings, '0.25s', '60%')
  }, [showSettings])

  const allToggleSettings = [
    { key: showDebugDetails, action: setShowDebugDetails, label: "Sketch Details", shortcut: "," },
    { key: showUnfetchedVertices, action: setShowUnfetchedVertices, label: "Display Unfetched Verts", shortcut: "." },
    { key: useOfflineData, action: setUseOfflineData, label: "Use Offline API data", shortcut: null },
    { key: showMedianAxis, action: setShowMedianAxis, label: "Axis orientation", shortcut: null },
    { key: showMedianBoundBox, action: setShowMedianBoundBox, label: "Bounding Box (median)", shortcut: null },
    { key: showDimensionBoundBox, action: setShowDimensionBoundBox, label: "Bounding Box (dimensions)", shortcut: null }
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

const SessionSettingsToggleOption: FC<SessionSettingsToggleOptionProps> = ({ isEnabled, onToggle, label, shortcut }) => {
  return (
    <div id='session-settings-toggle-contents'>
      <label id='session-settings-toggle-label'>
        {label}
      </label>
      <div>
        {shortcut && (
          <span id='setting-toggle-shortcut'>
            [{shortcut}]{" "}
          </span>
        )}
        <input
          id='setting-toggle-input'
          type="checkbox"
          checked={isEnabled}
          onChange={() => onToggle(prev => !prev)}
        />
      </div>
    </div>
  );
};
