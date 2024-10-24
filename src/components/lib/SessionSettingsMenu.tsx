import './SessionSettingsMenu.css'
import { Settings as SettingsIcon, Fetch } from '../../assets/icons';

import { ChangeEvent, createRef, Dispatch, FC, SetStateAction, useEffect, } from 'react';

import { toggleElementOpacity, toggleDisplayVisibility, changeFocusOpacity } from '..';
import { MainAppLayoutSessionState } from '../../app/MainAppLayout';

interface SessionSettingsMenuProps {
  sessionSettingsState: MainAppLayoutSessionState;
  refreshLayoutHandler: () => void;
}

const prfx = (sufx: string) => {
  return 'session-settings-' + sufx;
}

export const SessionSettingsMenu: FC<SessionSettingsMenuProps> = ({ sessionSettingsState, refreshLayoutHandler }) => {
  const { showSettings, setShowSettings,
    showDebugDetails, setShowDebugDetails,
    showMedianAxis, setShowMedianAxis,
    showMedianBoundBox, setShowMedianBoundBox,
    showDimensionBoundBox, setShowDimensionBoundBox,
    dataDensity, setDataDensity,
    attractionMult, setAttractionMult,
    repulsionMult, setRepulsionMult,
    activeQuerySession
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
    { key: dataDensity, action: setDataDensity, label: "Vertex Density", desc: "effects the overall size of the layout", step: '0.00001' },
    { key: attractionMult, action: setAttractionMult, label: "Attraction Multiplier", desc: "Tendency of related Vertices to clump together", step: '0.05' },
    { key: repulsionMult, action: setRepulsionMult, label: "Push Multiplier", desc: "Tendency of UN-related Vertices to push away from each other", step: '0.05' }
  ]

  return (
    <div id={prfx('container')} onClick={(e) => { e.stopPropagation() }}>
      <img id={prfx('icon')} src={SettingsIcon} alt='gear to toggle displaying current settings menu' onClick={() => setShowSettings(prev => !prev)} ref={iconRef} />

      <div id={prfx('menu-container')} ref={menuContainerRef} onClick={(e) => { e.stopPropagation() }}>
        <h3 id={prfx('menu-header')} onClick={(e) => { e.stopPropagation() }}>on-screen:</h3>
        {ToggleSettings.map((setting, index) => (
          <ToggleOption
            key={index}
            isEnabled={setting.key}
            onToggle={setting.action}
            activeSession={!activeQuerySession}
            label={setting.label}
            shortcut={setting.shortcut}
          />
        ))}
        <h3 id={prfx('menu-header')} onClick={(e) => { e.stopPropagation() }}>layout:</h3>
        {LayoutSettings.map((setting, index) => (
          <LayoutOption
            key={index}
            step={setting.step}
            curValue={setting.key}
            activeSession={activeQuerySession}
            setNumberVal={setting.action}
            label={setting.label}
            desc={setting.desc} />
        ))}
        <div id={prfx('refresh-layout-cont')} onClick={(e) => { e.stopPropagation() }}>
          <p id={prfx('refresh-layout-text')}>
            Refresh Layout
          </p>
          <button id={prfx('refresh-layout-btn')} onClick={refreshLayoutHandler} disabled={!activeQuerySession}>
            <img id={prfx('refresh-layout-icon')} src={Fetch} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToggleOptionProps {
  isEnabled: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
  label: string;
  shortcut: string | null;
  activeSession: boolean;
}

const ToggleOption: FC<ToggleOptionProps> = ({ isEnabled, onToggle, label, shortcut, activeSession }) => {
  return (
    <div id={prfx('toggle-contents')} onClick={(e) => { e.stopPropagation() }}>
      {shortcut && (
        <span id='setting-toggle-shortcut'>
          [{shortcut}]{" "}
        </span>
      )}
      <label id={prfx('toggle-label')} onClick={(e) => { e.stopPropagation() }}>
        {label}
      </label>
      <div>
        <input
          disabled={activeSession}
          id='setting-toggle-input'
          type="checkbox"
          checked={isEnabled}
          onChange={() => onToggle(prev => !prev)}
          onClick={(e) => { e.stopPropagation() }}
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
  step: string;
  activeSession: boolean;
}

const LayoutOption: FC<LayoutOptionProps> = ({ curValue, setNumberVal, label, desc, step, activeSession }) => {
  const onChangeNumConversionHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setNumberVal(newValue);
    }
  }

  return (
    <div id={prfx('layout-contents')} onClick={(e) => { e.stopPropagation() }}>
      <div id={prfx('layout-text-cont')}>
        <label id={prfx('layout-label')}>
          {label}
        </label>
        <div id={prfx('layout-dsc')}>
          {desc}
        </div>
      </div>
      <input
        disabled={!activeSession}
        step={step}
        id={prfx('layout-inp')}
        type='number'
        value={curValue}
        onClick={(e) => { e.stopPropagation() }}
        onChange={onChangeNumConversionHandler} />
    </div>
  )
}
