import './mouse-settings.css'
import { ChangeEvent, FC, useState } from "react"
import { WikiverseSketch } from '../../../../../types';

interface MouseSettingsProps {
  sketchRef: WikiverseSketch;
}

const ID = (sufx: string) => `mouse-settings-${sufx}`;

export const MouseSettings: FC<MouseSettingsProps> = ({ sketchRef }) => {
  const [xMouseSensRef, setXMouseSensRef] = useState(sketchRef.state.xMouseSens());
  const [yMouseSensRef, setYMouseSensRef] = useState(sketchRef.state.yMouseSens());
  const [zMouseSensRef, setZMouseSensRef] = useState(sketchRef.state.zMouseSens());

  const handleMouseSensChange = (e: ChangeEvent<HTMLInputElement>, tgt: string) => {
    const val = parseInt(e.target.value);
    switch (tgt) {
      case 'X-Axis':
        setXMouseSensRef(val);
        sketchRef.state.setXMouseSens(val);
        break;
      case 'Y-Axis':
        setYMouseSensRef(val);
        sketchRef.state.setYMouseSens(val);
        break;
      case 'Z-Axis':
        setZMouseSensRef(val);
        sketchRef.state.setZMouseSens(val);
        break;
      default:
        console.error(`invalid update target ${tgt}`)
        break;
    }
  }

  return (
    <fieldset id={ID('container')}>
      <legend>
        <h4 id={ID('title')}>mouse sensitivity</h4>
      </legend>

      <ul id={ID('list')}>
        <MouseSensitivityOption
          lbl='X-Axis'
          dsc='[horizontal]'
          senstivityValue={xMouseSensRef}
          updateHandler={handleMouseSensChange} />
        <MouseSensitivityOption
          lbl='Y-Axis'
          dsc='[vertical]'
          senstivityValue={yMouseSensRef}
          updateHandler={handleMouseSensChange} />
        <MouseSensitivityOption
          lbl='Z-Axis'
          dsc='[zoom]'
          senstivityValue={zMouseSensRef}
          updateHandler={handleMouseSensChange} />
      </ul>
    </fieldset>
  )
}

interface MouseSensitivityOptionProps {
  lbl: string;
  dsc: string;
  senstivityValue: number | undefined;
  updateHandler: (e: ChangeEvent<HTMLInputElement>, tgt: string) => void;
}

const MouseSensitivityOption: FC<MouseSensitivityOptionProps> = ({ lbl, dsc, senstivityValue, updateHandler }) => {
  return (
    <li className={ID('input-option')} id={`${lbl}-mouse-sensitivity`}>
      <label>{lbl} <span>{dsc}</span></label>
      <MouseSensitivityInput {...{ senstivityValue, updateHandler, lbl }} />
    </li>
  )
}

interface MouseSensitivityInputProps {
  senstivityValue: number | undefined;
  updateHandler: (e: ChangeEvent<HTMLInputElement>, tgt: string) => void;
  lbl: string
}

const MouseSensitivityInput: FC<MouseSensitivityInputProps> = ({ senstivityValue, updateHandler, lbl }) => {
  return (
    <>
      <input
        className='mouse-sens-input'
        type='number'
        min={1}
        max={10}
        step={1}
        value={senstivityValue}
        onChange={(e) => updateHandler(e, lbl)}
      />
    </>)
}