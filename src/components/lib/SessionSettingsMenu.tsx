import './SessionSettingsMenu.css'
import { Settings as SettingsIcon } from '../../assets/icons';

import { ChangeEvent, createRef, Dispatch, FC, SetStateAction, useEffect, } from 'react';

import { toggleElementOpacity, toggleDisplayVisibility, changeFocusOpacity } from '..';
import { MainAppLayoutSessionState } from '../../app/MainAppLayout';

interface SessionSettingsMenuProps {
  sessionSettingsState: MainAppLayoutSessionState;
}

const prfx = (sufx: string) => {
  return 'session-settings-' + sufx;
}

export const SessionSettingsMenu: FC<SessionSettingsMenuProps> = ({ sessionSettingsState }) => {
  const { showSettings, setShowSettings,
    showDebugDetails, setShowDebugDetails,
    showMedianAxis, setShowMedianAxis,
    showMedianBoundBox, setShowMedianBoundBox,
    showDimensionBoundBox, setShowDimensionBoundBox,
    dataDensity, setDataDensity,
    attractionMult, setAttractionMult,
    repulsionMult, setRepulsionMult
  } = sessionSettingsState;

  const menuContainerRef = createRef<HTMLDivElement>();
  const iconRef = createRef<HTMLImageElement>();

  useEffect(() => {
    toggleElementOpacity(menuContainerRef.current!, showSettings);
    toggleDisplayVisibility(menuContainerRef.current!, showSettings, 'grid')
    changeFocusOpacity(iconRef.current!, showSettings, '0.25s', '60%')
  }, [showSettings])

  const ToggleSettings = [
    { key: showDebugDetails, action: setShowDebugDetails, label: "Sketch Details", shortcut: "," },
    //! { key: useOfflineData, action: setUseOfflineData, label: "Use Offline API data", shortcut: null },
    { key: showMedianAxis, action: setShowMedianAxis, label: "Axis orientation", shortcut: null },
    { key: showMedianBoundBox, action: setShowMedianBoundBox, label: "Bounding Box (median)", shortcut: null },
    { key: showDimensionBoundBox, action: setShowDimensionBoundBox, label: "Bounding Box (dimensions)", shortcut: null }
  ]

  const LayoutSettings = [
    { key: dataDensity, action: setDataDensity, label: "Vertex Density", desc: "effects the overall size of the layout" },
    { key: attractionMult, action: setAttractionMult, label: "Attraction Multiplier", desc: "Tendency of related Vertices to clump together" },
    { key: repulsionMult, action: setRepulsionMult, label: "Push Multiplier", desc: "Tendency of UN-related Vertices to push away from each other" }
  ]

  return (
    <div id={prfx('container')} onClick={(e) => { e.stopPropagation() }}>
      <img id={prfx('icon')} src={SettingsIcon} alt='gear to toggle displaying current settings menu' onClick={() => setShowSettings(prev => !prev)} ref={iconRef} />
      <div id={prfx('menu-container')} ref={menuContainerRef}>
        <h3 id={prfx('menu-header')}>on-screen:</h3>
        {ToggleSettings.map((setting, index) => (
          <ToggleOption
            key={index}
            isEnabled={setting.key}
            onToggle={setting.action}
            label={setting.label}
            shortcut={setting.shortcut}
          />
        ))}
        <h3 id={prfx('menu-header')}>layout:</h3>
        {LayoutSettings.map((setting, index) => (
          <LayoutOption
            key={index}
            curValue={setting.key}
            setNumberVal={setting.action}
            label={setting.label}
            desc={setting.desc} />
        ))}
      </div>
    </div>
  );
};

interface ToggleOptionProps {
  isEnabled: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
  label: string;
  shortcut: string | null;
}

const ToggleOption: FC<ToggleOptionProps> = ({ isEnabled, onToggle, label, shortcut }) => {
  return (
    <div id={prfx('toggle-contents')}>
      {shortcut && (
        <span id='setting-toggle-shortcut'>
          [{shortcut}]{" "}
        </span>
      )}
      <label id={prfx('toggle-label')}>
        {label}
      </label>
      <div>
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

interface LayoutOptionProps {
  curValue: number;
  setNumberVal: Dispatch<SetStateAction<number>>;
  label: string;
  desc: string;
}

const LayoutOption: FC<LayoutOptionProps> = ({ curValue, setNumberVal, label, desc }) => {
  const onChangeNumConversionHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setNumberVal(newValue);
    }
  }

  return (
    <div id={prfx('layout-contents')}>
      <div id={prfx('layout-text-cont')}>
        <label id={prfx('layout-label')}>
          {label}
        </label>
        <div id={prfx('layout-dsc')}>
          {desc}
        </div>
      </div>
      <input
        id={prfx('layout-inp')}
        type='number'
        value={curValue}
        onChange={onChangeNumConversionHandler} />
    </div>
  )
}
