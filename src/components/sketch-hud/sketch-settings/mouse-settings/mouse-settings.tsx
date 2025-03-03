import "./mouse-settings.css";
import { ChangeEvent, useState } from "react";

import { SketchRefProps } from "../../../../types";
import { useComponentID } from "../../../../hooks";

/**
 * Contains settings UI which modifies how sensitive the mouse is to input on the 3 priamry axis [X,Y,Z(oom)]
 *
 * @component
 * @param {SketchRefProps} sketchRef - reference to the currently active sketch object
 *
 * @remark
 * This component uses react elements to modify state effecting how the {@link P5Sketch} instance behaves.
 * Control only flows into the sketch instance so state is set twice each time its modified (locally and in the sketch)
 *
 * @hooks
 * - useState() - tracks X, Y, & Z(oom) sensitivity state
 */
export const MouseSettings = ({ sketchRef }: SketchRefProps) => {
  const { ID } = useComponentID("mouse-settings");
  const [xMouseSensRef, setXMouseSensRef] = useState(
    sketchRef.state.xMouseSens()
  );
  const [yMouseSensRef, setYMouseSensRef] = useState(
    sketchRef.state.yMouseSens()
  );
  const [zMouseSensRef, setZMouseSensRef] = useState(
    sketchRef.state.zMouseSens()
  );

  const handleMouseSensChange = (
    e: ChangeEvent<HTMLInputElement>,
    tgt: string
  ) => {
    const val = parseInt(e.target.value);
    switch (tgt) {
      case "X-Axis":
        setXMouseSensRef(val);
        sketchRef.state.setXMouseSens(val);
        break;
      case "Y-Axis":
        setYMouseSensRef(val);
        sketchRef.state.setYMouseSens(val);
        break;
      case "Z-Axis":
        setZMouseSensRef(val);
        sketchRef.state.setZMouseSens(val);
        break;
      default:
        console.error(`invalid update target ${tgt}`);
        break;
    }
  };

  return (
    <fieldset id={ID("container")}>
      <legend>
        <h4 id={ID("title")}>mouse sensitivity</h4>
      </legend>

      <ul id={ID("list")}>
        <MouseSensitivityOption
          lbl="X-Axis"
          dsc="[horizontal]"
          senstivityValue={xMouseSensRef}
          updateHandler={handleMouseSensChange}
          ID={ID}
        />
        <MouseSensitivityOption
          lbl="Y-Axis"
          dsc="[vertical]"
          senstivityValue={yMouseSensRef}
          updateHandler={handleMouseSensChange}
          ID={ID}
        />
        <MouseSensitivityOption
          lbl="Z-Axis"
          dsc="[zoom]"
          senstivityValue={zMouseSensRef}
          updateHandler={handleMouseSensChange}
          ID={ID}
        />
      </ul>
    </fieldset>
  );
};

interface MouseSensitivityOptionProps {
  lbl: string;
  dsc: string;
  senstivityValue: number | undefined;
  updateHandler: (e: ChangeEvent<HTMLInputElement>, tgt: string) => void;
  ID: (sufx: string) => string;
}

/**
 * Sub - @component
 * @remark
 * Builds out the actual number input container for each of the 3 axis...
 */
const MouseSensitivityOption = ({
  lbl,
  dsc,
  senstivityValue,
  updateHandler,
  ID,
}: MouseSensitivityOptionProps) => {
  return (
    <li className={ID("input-option")} id={`${lbl}-mouse-sensitivity`}>
      <label>
        {lbl} <span>{dsc}</span>
      </label>
      <MouseSensitivityInput {...{ senstivityValue, updateHandler, lbl }} />
    </li>
  );
};

interface MouseSensitivityInputProps {
  senstivityValue: number | undefined;
  updateHandler: (e: ChangeEvent<HTMLInputElement>, tgt: string) => void;
  lbl: string;
}

/**
 * Sub-Sub - @component
 * @remark
 * The wrapper for the input element itself
 */
const MouseSensitivityInput = ({
  senstivityValue,
  updateHandler,
  lbl,
}: MouseSensitivityInputProps) => {
  return (
    <>
      <input
        className="mouse-sens-input"
        type="number"
        min={1}
        max={10}
        step={1}
        value={senstivityValue}
        onChange={e => updateHandler(e, lbl)}
      />
    </>
  );
};
