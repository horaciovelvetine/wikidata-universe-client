import "./loading-bar.css";

interface LoadingBarProps {
  isLoading: boolean;
}

/**
 * Gradient bar positioned at the top of the DOM which (over the course of 3 seconds) is displayed when the
 * {@link WikiverseServiceProvider} set's internal state of isLoading() to true.
 *
 * @component
 * @param {boolean} props.isLoading - wether or not this element will be actively on screen
 *
 * @remark
 * This component is rendered inside the {@link WikiverseServiceProvider} exclusively
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
