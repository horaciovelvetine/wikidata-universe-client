import "./re-search-input.css";
import { Search, SearchDngr } from "../../../assets/icons";
import {
  createRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";

//TODO - remove animations
import { errorShakeReSearchContainer } from "../animations/error-shake-re-search-container";
import { moveReSearchInputInView } from "../animations/move-re-search-input-in-view";
import { showHideReSearchInput } from "../animations/show-hide-re-search-input";
import { P5Sketch, WikiverseServiceResponse } from "../../../types";
import {
  useDeviceCompatabilityCheck,
  useWikiverseService,
} from "../../../providers";
import { useComponentID } from "../../../hooks";

interface ReSearchInputProps {
  sketchRef: P5Sketch;
  setSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}
/**
 * ReSearchInput component allows users to input and submit search queries.
 * It integrates with a P5 sketch and updates the sketch's query state.
 * The component also handles device compatibility checks and adjusts its visibility accordingly.
 *
 * @param {ReSearchInputProps} props - The properties for the ReSearchInput component:
 * @prop {P5Sketch} props.sketchRef - Reference to the P5 sketch instance.
 * @prop {Dispatch<SetStateAction<WikiverseServiceResponse | null>>} props.setSketchData - Function to set the initial sketch data.
 */
export const ReSearchInput = ({
  sketchRef,
  setSketchData,
}: ReSearchInputProps) => {
  const { ID } = useComponentID("re-search");
  const [query, setQuery] = useState(sketchRef.state.query());

  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const { getNewQueryData, requestError } = useWikiverseService();

  useEffect(() => {
    // tell sketch how to update query...
    sketchRef.state.addQuerySubscriber(setQuery);
  });

  const handleNewSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await getNewQueryData(query);
    if (requestError) {
      // todo handle the requst error, or early jump out...
      debugger;
    }

    // todo handle rest of search stuff
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    sketchRef.state.setQuery(e.target.value);
  };

  const containerClass = !sketchRef
    ? ""
    : requestError
      ? "res-error"
      : "on-screen";

  return (
    <div id={ID("container")} className={containerClass}>
      <div id={ID("icon-container")}>
        <img
          id={ID("icon")}
          src={Search}
          className={requestError ? "res-error" : ""}
        />
        <img
          id={ID("error-icon")}
          src={SearchDngr}
          className={requestError ? "res-error" : ""}
        />
      </div>
      <form id={ID("form")} onSubmit={handleNewSearchSubmit}>
        <input
          id={ID("input")}
          type="text"
          value={query}
          onChange={handleSearchInputChange}
          className={requestError ? "res-error" : ""}
        />
      </form>
    </div>
  );
};
