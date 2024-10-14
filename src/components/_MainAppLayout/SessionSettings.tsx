import './SessionSettingsStyle.css'

import { createRef, FC, useEffect, useState } from 'react';

import { Settings as SettingsIcon } from '../../assets/icons';
import { SessionSettingsState } from '../../interfaces/'
import { SessionSettingsToggleOption } from './SessionSettingsToggleOption';
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

  const allToggleSettings = [
    { key: showDebugDetails, action: setShowDebugDetails, label: "Debug Details", shortcut: "," },
    { key: showUnfetchedVertices, action: setShowUnfetchedVertices, label: "Unfetched Vertices", shortcut: "u" },
    { key: showMedianAxis, action: setShowMedianAxis, label: "Median Orientation Axis", shortcut: "a" },
    { key: showMedianBoundBox, action: setShowMedianBoundBox, label: "Median Bounding Box", shortcut: "m" },
    { key: showDimensionBoundBox, action: setShowDimensionBoundBox, label: "Dimension Bounding Box", shortcut: "d" }
  ]

  return (
    <div id='session-settings-container' onClick={(e) => { e.stopPropagation() }}>
      <img id='session-settings-icon' src={SettingsIcon} alt='gear to toggle displaying current settings menu' onClick={() => setShowMenu(prev => !prev)} ref={iconRef} />
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
