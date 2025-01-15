import './loading-bar.css'
import { FC } from "react"

interface LoadingBarProps {
  isLoading: boolean;
}

/**
 * @Credit to Marco Biedermann for the codepen: https://codepen.io/marcobiedermann/pen/LExXWW, and fantastic gradient colors & loading bar
 * Find him on @Github - https://github.com/marcobiedermann/ or @marcobiedermann
 */
export const LoadingBar: FC<LoadingBarProps> = ({ isLoading }) => {
  return (
    <div id='loading-bar-container'>
      {isLoading ?
        <div id='gradient-loading-bar'>
          <div id='gradient-shadow-progress'></div>
        </div> : <></>}
    </div>
  )
}