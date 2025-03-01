import "./re-search-input.css";
import { Search, SearchDngr } from "../../../assets/icons";
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";

import { useComponentID } from "../../../hooks";
import { P5Sketch, WikiverseServiceResponse } from "../../../types";
import {
  useDeviceCompatabilityCheck,
  useWikiverseService,
} from "../../../providers";

interface RSIProps {
  sketchRef: P5Sketch;
  setSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

/**
 * ReSearchInput component allows users to input and submit search queries.
 * It integrates with a P5 sketch and updates the sketch's query state.
 * The component also handles device compatibility checks and adjusts its visibility accordingly.
 *
 * @prop {P5Sketch} props.sketchRef - Reference to the P5 sketch instance.
 * @prop {Dispatch<SetStateAction<WikiverseServiceResponse | null>>} props.setSketchData - Function to set the initial sketch data.
 */
export const ReSearchInput = ({ sketchRef, setSketchData }: RSIProps) => {
  const { ID } = useComponentID("re-search");
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const { getNewQueryData, requestError, isOnline } = useWikiverseService();

  const [query, setQuery] = useState(sketchRef.state.query());
  const [isShown, setIsShown] = useState(false); // used to animate input on screen
  const [isErrored, setIsErrored] = useState(requestError); // false by default;

  useEffect(() => {
    // subscribe to the sketch query state updates...
    sketchRef.state.addQuerySubscriber(setQuery);
    setIsShown(meetsMinScreenSizeReq && isOnline); // trigger transition animation
  });

  const handleNewSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query === "") {
      // query cannot be empty...
      setIsErrored(true);
      setTimeout(() => {
        setIsErrored(false);
        // restore local state to sync with sketch state
        setQuery(sketchRef.state.query());
      }, 820);
      return;
    }

    const data = await getNewQueryData(query);
    setSketchData(data);
  };

  /**
   * @apiNote - this input is controlled to be able to both subscribe to query updates from the sketch and at the same time allow the user to modify the field w/o neccasarily changing the sketches stored value for query until we are sure they are going to start a whole new sketch
   */
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  return (
    <div id={ID("container")} className={isErrored ? "error-animate" : ""}>
      <div
        id={ID("layout")}
        className={
          isShown && meetsMinScreenSizeReq && isOnline ? "on-screen" : ""
        }
      >
        <div id={ID("icon-container")}>
          <img
            id={ID("icon")}
            src={Search}
            className={isErrored ? "error-animate" : ""}
          />
          <img
            id={ID("error-icon")}
            src={SearchDngr}
            className={isErrored ? "error-animate" : ""}
          />
        </div>
        <form id={ID("form")} onSubmit={handleNewSearchSubmit}>
          <input
            id={ID("input")}
            type="text"
            value={query}
            onChange={handleSearchInputChange}
            className={isErrored ? "error-animate" : ""}
          />
        </form>
      </div>
    </div>
  );
};
