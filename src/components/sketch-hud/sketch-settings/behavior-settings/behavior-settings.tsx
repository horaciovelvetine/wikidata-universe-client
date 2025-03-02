import "./behavior-settings.css";
import { P5Sketch } from "../../../../types";

import { useEffect, useState } from "react";
import { useComponentID } from "../../../../hooks";

interface BehaviorSettingsProps {
  sketchRef: P5Sketch;
}

/**
 * Component containing settings UI which directly modifies how the current sketch instance
 * behaves on targeted user inputs.
 *
 * @component
 * @param {BehaviorSettingsProps} props - The properties for the BehaviorSettings component.
 * @param {P5Sketch} props.sketchRef - Reference to the P5 sketch instance.
 *
 * @returns {JSX.Element} BehaviorSettings component.
 *
 * @remarks
 * This component allows users to toggle the "Click to Fetch" behavior of the sketch.
 * It subscribes to the sketch's state and updates the checkbox accordingly.
 *
 * @hook
 * - useEffect: Subscribes to the sketch's state changes.
 * - useState: Manages the state of the "Click to Fetch" checkbox.
 */
export const BehaviorSettings = ({ sketchRef }: BehaviorSettingsProps) => {
  const { ID } = useComponentID("behavior-settings");
  const [clickToFetchRef, setClickToFetchRef] = useState(
    sketchRef.state.clickToFetchEnabled()
  );

  useEffect(() => {
    sketchRef.state.addClickToFetchSubscriber(setClickToFetchRef);
  });

  const handleClickToFetchToggle = () => {
    setClickToFetchRef(prev => !prev);
    sketchRef.state.toggleClickToFetch();
  };

  return (
    <fieldset id={ID("container")}>
      <legend>
        <h4 id={ID("title")}>behavior</h4>
      </legend>
      <ul id={ID("list")}>
        <li className={ID("option")}>
          <div className={ID("option-text")}>
            <label>Click to Fetch</label>
            <p>
              Selecting a new Topic will fetch it's related data when enabled
            </p>
          </div>
          <input
            type="checkbox"
            checked={clickToFetchRef}
            onChange={handleClickToFetchToggle}
            name="click-to-fetch"
          />
        </li>
      </ul>
    </fieldset>
  );
};
