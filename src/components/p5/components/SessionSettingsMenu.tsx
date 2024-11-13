import './SessionSettingsMenu.css'
import { Settings as SettingsIcon, Fetch, Search } from '../../../assets/icons';

import { ChangeEvent, createRef, Dispatch, FC, FormEvent, MouseEvent, SetStateAction, useEffect, useState } from 'react';

import { toggleElementOpacity, toggleDisplayVisibility, changeFocusOpacity } from '../..';
import { MainAppLayoutState } from '../../../app/MainAppLayoutState';
import { getQueryData, RequestResponse } from '../../../api';

interface SessionSettingsMenuProps {
  mainAppLayoutState: MainAppLayoutState
  setInitSketchAPIRes: Dispatch<SetStateAction<RequestResponse | null>>
}

const prfx = (sufx: string) => {
  return 'session-settings-' + sufx;
}

export const SessionSettingsMenu: FC<SessionSettingsMenuProps> = ({ mainAppLayoutState, setInitSketchAPIRes }) => {
  const menuContainerRef = createRef<HTMLDivElement>();
  const gearIconRef = createRef<HTMLImageElement>();
  const searchIconRef = createRef<HTMLImageElement>();
  const searchInputRef = createRef<HTMLInputElement>();

  const { showSettings, setShowSettings, showDebugDetails, setShowDebugDetails, p5SketchRef, setIsLoading, showWikiverseSketch } = mainAppLayoutState;

  const [searchInpActive, setSearchInpActive] = useState(false);
  const [searchInp, setSearchInp] = useState(p5SketchRef ? p5SketchRef.QUERY() : undefined);
  const [dataDensityInp, setDataDensityInp] = useState(p5SketchRef ? p5SketchRef.LAYOUT_CONFIG().dataDensity : null);
  const [attractionMultInp, setAttractionMultInp] = useState(p5SketchRef ? p5SketchRef.LAYOUT_CONFIG().attractionMult : null)
  const [repulsioMultInp, setRepulsionMultInp] = useState(p5SketchRef ? p5SketchRef.LAYOUT_CONFIG().repulsionMult : null)
  const [showAxisInp, setShowAxisInp] = useState(p5SketchRef ? p5SketchRef.UI().getShowAxis() : false);
  const [showBoundingInp, setShowBoundingInp] = useState(p5SketchRef ? p5SketchRef.UI().getShowBoundingBox() : false);

  useEffect(() => {
    toggleElementOpacity(menuContainerRef.current!, showSettings);
    toggleDisplayVisibility(menuContainerRef.current!, showSettings, 'grid')
    changeFocusOpacity(gearIconRef.current!, showSettings, '0.25s', '70%')
  })

  useEffect(() => {
    if (!p5SketchRef) return;
    setDataDensityInp(p5SketchRef.LAYOUT_CONFIG().dataDensity)
    setAttractionMultInp(p5SketchRef.LAYOUT_CONFIG().attractionMult)
    setRepulsionMultInp(p5SketchRef.LAYOUT_CONFIG().repulsionMult)
  })

  useEffect(() => {
    if (!p5SketchRef) return;
    p5SketchRef.UI().toggleShowAxis();
  }, [showAxisInp])

  useEffect(() => {
    if (!p5SketchRef) return;
    p5SketchRef.UI().toggleShowBoundingBox();
  }, [showBoundingInp])

  useEffect(() => {
    changeFocusOpacity(searchIconRef.current!, searchInpActive, '0.25s', '70%')
    if (searchInpActive) {
      searchInputRef.current!.style.opacity = '100%';
    } else {
      searchInputRef.current!.style.opacity = '0';
    }
  }, [searchInpActive])

  useEffect(() => {
    setSearchInp(p5SketchRef?.QUERY());
  }, [p5SketchRef?.QUERY()])

  const ToggleSettings = p5SketchRef ? [
    { key: showDebugDetails, action: setShowDebugDetails, label: "Graph Details", shortcut: "," },
    { key: showAxisInp, action: setShowAxisInp, label: "Axis Orientation", shortcut: null },
    { key: showBoundingInp, action: setShowBoundingInp, label: "Bounding Box", shortcut: null },
  ] : [];

  const LayoutSettings = p5SketchRef ? [
    { key: dataDensityInp, action: setDataDensityInp, label: "Density", desc: "Effects the overall size of the Graph's layout", step: '0.00001' },
    { key: attractionMultInp, action: setAttractionMultInp, label: "Attraction Force", desc: "The tendency of related Vertices to clump together", step: '0.05' },
    { key: repulsioMultInp, action: setRepulsionMultInp, label: "Repulsion Force", desc: "The tendency of un-related Vertices to push away from eachother ", step: '0.05' },
  ] : [];

  const handleRefreshLayoutPositionClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (p5SketchRef == null) return;
    p5SketchRef.LAYOUT_CONFIG().updateConfigValues(dataDensityInp!, attractionMultInp!, repulsioMultInp!);
    p5SketchRef.refreshLayoutPositions();
    setShowSettings(false);
  }

  const handleSearchInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInp(e.target.value);
  }

  const handleSearchInputSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInp == undefined) return;
    setIsLoading(true);
    await getQueryData(searchInp)
      .then(res => {
        setInitSketchAPIRes(res);
      })
      .catch(err => {
        console.error(err);
      })
    //loading state removed by new sketch...
  };

  const handleSearchIconClick = () => {
    if (showWikiverseSketch) {
      setSearchInpActive(prev => !prev);
    }
  };


  return (
    <div id={prfx('display')} onClick={(e) => { e.stopPropagation() }}>
      <div id={prfx('icon-container')}>
        <form onSubmit={handleSearchInputSubmit}>
          <input
            id={prfx('search-input')}
            ref={searchInputRef}
            value={searchInp}
            type='text'
            placeholder='Search...'
            onChange={handleSearchInputChange}
          />
        </form>
        <img id={prfx('search-icon')} src={Search} ref={searchIconRef} onClick={handleSearchIconClick} />
        <img id={prfx('gear-icon')} src={SettingsIcon} ref={gearIconRef} onClick={() => setShowSettings(prev => !prev)} />
      </div>


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
