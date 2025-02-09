import { P5Sketch } from "../../../../../types";
import "./behavior-settings.css";

import { useEffect, useState } from "react";

interface BehaviorSettingsProps {
  sketchRef: P5Sketch;
}

const ID = (sufx: string) => `behavior-settings-${sufx}`;

export const BehaviorSettings = ({ sketchRef }: BehaviorSettingsProps) => {
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
