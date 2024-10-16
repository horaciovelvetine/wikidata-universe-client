import { FC, Dispatch, SetStateAction } from 'react';

interface SessionSettingsToggleOptionProps {
  isEnabled: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
  label: string;
  shortcut: string | null;
}

export const SessionSettingsToggleOption: FC<SessionSettingsToggleOptionProps> = ({ isEnabled, onToggle, label, shortcut }) => {
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
