import "./loading-bar.css";

interface LoadingBarProps {
  isLoading: boolean;
}

/**
 * Gradient bar positioned at the top of the DOM which (over the course of 3 seconds) progresses whenever the @state isLoading
 * is true inside of the @see WikiverseServiceProvider, which makes requests to the backend API.
 *
 * @Credit to Marco Biedermann for the codepen: https://codepen.io/marcobiedermann/pen/LExXWW, and fantastic gradient colors & loading bar
 * Find him on @Github - https://github.com/marcobiedermann/ or @marcobiedermann
 */
export const LoadingBar = ({ isLoading }: LoadingBarProps) => {
  return (
    <div id="loading-bar-container">
      {isLoading ? (
        <div id="gradient-loading-bar">
          <div id="gradient-shadow-progress"></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
