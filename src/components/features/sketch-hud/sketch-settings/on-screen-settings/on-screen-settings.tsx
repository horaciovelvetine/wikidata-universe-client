import './on-screen-settings.css'
import { ChangeEvent, FC, useEffect, useState } from "react"
import { WikiverseSketch } from '../../../../../types';

interface OnScreenSettingsProps {
  sketchRef: WikiverseSketch;
}

const ID = (sufx: string) => `on-screen-settings-${sufx}`;

export const OnScreenSettings: FC<OnScreenSettingsProps> = ({ sketchRef }) => {
  const [showSketchSummaryRef, setShowSketchSummaryRef] = useState(sketchRef.state.showSketchDetailsSummary());
  const [showBoundingBoxRef, setShowBoundingBoxRef] = useState(sketchRef.state.showBoundingBox());
  const [showAxisOrientationRef, setShowAxisOrientationRef] = useState(sketchRef.state.showAxisOrientation());

  useEffect(() => {
    sketchRef.state.addShowSketchDetailsSummarySubscriber(setShowSketchSummaryRef);
  })

  const handleShowHideSketchDetailsSummaryClick = () => {
    setShowSketchSummaryRef(prev => !prev);
    sketchRef.state.toggleShowSketchDetailsSummary();
  }

  const handleShowHideBoundingBox = () => {
    setShowBoundingBoxRef(prev => !prev);
    sketchRef.state.toggleShowBoundingBox();
  }

  const handleShowHideAxisOrientation = () => {
    setShowAxisOrientationRef(prev => !prev);
    sketchRef.state.toggleShowAxisOrientation();
  }

  return (
    <fieldset id={ID('container')}>
      <legend>
        <h4 id={ID('title')}>on-screen</h4>
      </legend>

      <ul id={ID('list')}>
        <ToggleSetting lbl='Graph Statistics' checkState={showSketchSummaryRef} toggleState={handleShowHideSketchDetailsSummaryClick} shortcut='[,]' />
        <ToggleSetting lbl='Bounding Box' checkState={showBoundingBoxRef} toggleState={handleShowHideBoundingBox} />
        <ToggleSetting lbl='Axis Orientation' checkState={showAxisOrientationRef} toggleState={handleShowHideAxisOrientation} />
      </ul>
    </fieldset>
  )
}

interface ToggleSettingProps {
  shortcut?: string;
  lbl: string
  checkState: boolean | undefined;
  toggleState: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSetting: FC<ToggleSettingProps> = ({ shortcut, lbl, checkState, toggleState }) => {
  return (
    <li className={ID('option-container')}>
      <label>{lbl} <span>{shortcut}</span></label>
      <input checked={checkState} type='checkbox' onChange={(e) => toggleState(e)} name='toggle-show-hide' />
    </li>)
}