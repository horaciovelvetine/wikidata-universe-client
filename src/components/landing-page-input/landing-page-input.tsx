import "./landing-page-input.css";
import {
  createRef,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";

import { Search, SearchDngr } from "../../assets/icons";

import { WikiverseServiceResponse } from "../../types";
import { useWikiverseService } from "../../providers";
import { useComponentID } from "../../hooks";
import { WIKIDATA_HOMEPAGE } from "../../app";

interface LPInputProps {
  sketchData: WikiverseServiceResponse | null;
  setSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

/**
 * The primary landing UI for the application which prompts the user for their search to initialize a new {@link P5Sketch}
 *
 * @component
 * @param {WikiverseServiceResponse | null} props.sketchData - used to determine the visibility of this @component
 * @param {setSketchData} props.setSketchData - setter used to initialize a new sketch and begin the apps primary functionality.
 *
 * @hook
 * - useState() - isErrored state tracked to animate elements when a query is invalid
 */
export const LandingPageInput = ({
  sketchData,
  setSketchData,
}: LPInputProps) => {
  const { ID } = useComponentID("main-landing");
  const { isOnline, requestError, getNewQueryData } = useWikiverseService();
  const [isErrored, setIsErrored] = useState(requestError); // false by default
  const inputRef = createRef<HTMLInputElement>();

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newQuery = inputRef.current?.value || "";
    if (newQuery === "") {
      // no input provided - cycle local err state
      setIsErrored(true);
      setTimeout(() => {
        setIsErrored(false);
      }, 820);
      return;
    }
    const data = await getNewQueryData(newQuery);
    setSketchData(data);
  };

  return (
    <div
      id={ID("container")}
      className={!sketchData && isOnline ? "on-screen" : ""}
    >
      <h1 id={ID("title")}>
        Explore{" "}
        <a id={ID("wikidata-link")} href={WIKIDATA_HOMEPAGE} target="_blank">
          Wikipedia
        </a>{" "}
        in 3D
      </h1>
      <form id={ID("form")} onSubmit={handleSearchSubmit}>
        <input
          id={ID("input")}
          type="text"
          placeholder="Search..."
          autoFocus={true}
          ref={inputRef}
          className={isErrored ? "error-animated" : ""}
        />
        <button
          id={ID("search-submit")}
          type="submit"
          className={isErrored ? "error-animated" : ""}
        >
          <img
            id={ID("search-icon-danger")}
            src={SearchDngr}
            className={isErrored ? "error-animated" : ""}
          />
          <img
            id={ID("search-icon")}
            src={Search}
            className={isErrored ? "error-animated" : ""}
          />
        </button>
      </form>
    </div>
  );
};
