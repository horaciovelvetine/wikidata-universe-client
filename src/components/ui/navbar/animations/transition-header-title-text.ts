import { Dispatch, RefObject, SetStateAction } from "react";
import { WikiverseSketch } from "../../../../types";

/**
 * @method transitionHeaderTitleText() - handles swapping the main site title from a simple title when no sketch is active to the compound 'explore' title for use in tandem with the re-search-input to make the site title a part of the useable sketch UI. Helper handles changing the title text state as well as animating both ref's to the appropriate position. @see 'navbar-container.css' - for details about the animations  
 */
export function transitionHeaderTitleText(titleRef: RefObject<HTMLHeadingElement>, exploreRef: RefObject<HTMLHeadingElement>, setTitle: Dispatch<SetStateAction<string>>, meetsMinScreenSize: boolean, sketchRef: WikiverseSketch | null) {
  const titleEl = titleRef.current;
  const exploreEl = exploreRef.current;

  if (!titleEl || !exploreEl) return; // no elements to move...

  if (sketchRef && meetsMinScreenSize) {
    setTitle('in 3D');
    titleEl.style.transform = 'scale(35%) translateY(-75%)';
    exploreEl.style.transform = 'translateY(0%)';
  } else { // default title setup...
    setTitle('the Wikiverse');
    titleEl.style.transform = 'scale(100%) translateY(0%)';
    exploreEl.style.transform = 'translateY(150%)';
  }
}