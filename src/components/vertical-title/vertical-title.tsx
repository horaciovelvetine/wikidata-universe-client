/**
 * A Vertically run text title which appears in the #4 grid spot (left middle) on
 * larger screens to make the grayspace a bit more interesting for widescreens.
 * It uses a custom hook `useComponentID` to generate unique IDs for the elements.
 */
import "./vertical-title.css";
import { useComponentID } from "../../hooks";

export const VerticalTitle = () => {
  const { ID } = useComponentID("vertical-title");
  return (
    <div id={ID("cont")}>
      <h1 id={ID("text")}>wikiverse</h1>
    </div>
  );
};
