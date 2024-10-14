import React, { Dispatch, SetStateAction } from 'react';

interface SessionSettingsToggleOptionProps {
  isEnabled: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
  label: string;
  shortcut: string;
}

export const SessionSettingsToggleOption: React.FC<SessionSettingsToggleOptionProps> = ({ isEnabled, onToggle, label, shortcut }) => {
  return (
    <div id='session-settings-toggle-contents'>
      <label id='session-settings-toggle-label'>
        {label}
      </label>
      <div>
        <span id='setting-toggle-shortcut'>
          [{shortcut}]{" "}
        </span>
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
