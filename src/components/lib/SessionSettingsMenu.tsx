import './SessionSettingsMenu.css'
import { Settings as SettingsIcon, Fetch } from '../../assets/icons';

import { ChangeEvent, createRef, Dispatch, FC, MouseEvent, SetStateAction, useEffect, useState } from 'react';

import { toggleElementOpacity, toggleDisplayVisibility, changeFocusOpacity } from '..';
import { SketchManager } from '../../models';
import { MainAppLayoutState } from '../../app/MainAppLayoutState';

interface SessionSettingsMenuProps {
  mainAppLayoutState: MainAppLayoutState;
  wikiverseSketchRef: SketchManager | null;
}

const prfx = (sufx: string) => {
  return 'session-settings-' + sufx;
}

export const SessionSettingsMenu: FC<SessionSettingsMenuProps> = ({ mainAppLayoutState, wikiverseSketchRef }) => {
  const menuContainerRef = createRef<HTMLDivElement>();
  const iconRef = createRef<HTMLImageElement>();
  const { showSettings, setShowSettings, showDebugDetails, setShowDebugDetails } = mainAppLayoutState;

  const [dataDensityInp, setDataDensityInp] = useState(wikiverseSketchRef ? wikiverseSketchRef.LAYOUT_CONFIG().dataDensity : null);
  const [attractionMultInp, setAttractionMultInp] = useState(wikiverseSketchRef ? wikiverseSketchRef.LAYOUT_CONFIG().attractionMult : null)
  const [repulsioMultInp, setRepulsionMultInp] = useState(wikiverseSketchRef ? wikiverseSketchRef.LAYOUT_CONFIG().repulsionMult : null)
  const [showAxisInp, setShowAxisInp] = useState(wikiverseSketchRef ? wikiverseSketchRef.UI().getShowAxis() : false);
  const [showBoundingInp, setShowBoundingInp] = useState(wikiverseSketchRef ? wikiverseSketchRef.UI().getShowBoundingBox() : false);

  useEffect(() => {
    toggleElementOpacity(menuContainerRef.current!, showSettings);
    toggleDisplayVisibility(menuContainerRef.current!, showSettings, 'grid')
    changeFocusOpacity(iconRef.current!, showSettings, '0.25s', '60%')
  }, [showSettings])

  useEffect(() => {
    if (!wikiverseSketchRef) return;
    setDataDensityInp(wikiverseSketchRef.LAYOUT_CONFIG().dataDensity)
    setAttractionMultInp(wikiverseSketchRef.LAYOUT_CONFIG().attractionMult)
    setRepulsionMultInp(wikiverseSketchRef.LAYOUT_CONFIG().repulsionMult)
  }, [wikiverseSketchRef])

  useEffect(() => {
    if (!wikiverseSketchRef) return;
    wikiverseSketchRef.UI().toggleShowAxis();
  }, [showAxisInp])

  useEffect(() => {
    if (!wikiverseSketchRef) return;
    wikiverseSketchRef.UI().toggleShowBoundingBox
  }, [showBoundingInp])

  const ToggleSettings = wikiverseSketchRef ? [
    { key: showDebugDetails, action: setShowDebugDetails, label: "Graph Details", shortcut: "," },
    { key: showAxisInp, action: setShowAxisInp, label: "Axis Orientation", shortcut: null },
    { key: showBoundingInp, action: setShowBoundingInp, label: "Bounding Box", shortcut: null },
  ] : [];

  const LayoutSettings = wikiverseSketchRef ? [
    { key: dataDensityInp, action: setDataDensityInp, label: "Density", desc: "Effects the overall size of the Graph's layout", step: '0.00001' },
    { key: attractionMultInp, action: setAttractionMultInp, label: "Attraction Force", desc: "The tendency of related Vertices to clump together", step: '0.05' },
    { key: repulsioMultInp, action: setRepulsionMultInp, label: "Repulsion Force", desc: "The tendency of un-related Vertices to push away from eachother ", step: '0.05' },
  ] : [];

  const handleRefreshLayoutPositionClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (wikiverseSketchRef == null) return;
    wikiverseSketchRef.LAYOUT_CONFIG().updateConfigValues(dataDensityInp!, attractionMultInp!, repulsioMultInp!);
    wikiverseSketchRef.refreshLayoutPositions();
  }

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
            step={setting.step}
            curValue={setting.key}
            setNumberVal={setting.action}
            label={setting.label}
            desc={setting.desc} />
        ))}
        <div id={prfx('refresh-layout-cont')}>
          <p id={prfx('refresh-layout-text')}>
            Refresh Layout
          </p>
          <button id={prfx('refresh-layout-btn')} onClick={handleRefreshLayoutPositionClick}>
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
}

const ToggleOption: FC<ToggleOptionProps> = ({ isEnabled, onToggle, label, shortcut }) => {
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
  curValue: number | null;
  setNumberVal: Dispatch<SetStateAction<number | null>>;
  label: string;
  desc: string;
  step: string;
}

const LayoutOption: FC<LayoutOptionProps> = ({ curValue, setNumberVal, label, desc, step }) => {
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
        step={step}
        id={prfx('layout-inp')}
        type='number'
        value={curValue ? curValue : 0}
        onClick={(e) => { e.stopPropagation() }}
        onChange={onChangeNumConversionHandler} />
    </div>
  )
}
