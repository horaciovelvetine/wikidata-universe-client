import './navbar-container.css'
import { createRef, Dispatch, FC, SetStateAction, useEffect, useState } from "react"

import { ReSearchInput, SettingsOpenIndicator, SketchDetailsSummary, transitionHeaderTitleText } from '..';
import { WikiverseSketch } from '../../../../types';
import { useDeviceCompatabilityCheck, WikiverseServiceResponse } from '../../../../app';

interface NavbarContainerProps {
  sketchRef: WikiverseSketch | null;
  setInitSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

const ID = (sufx: string) => `navbar-${sufx}`

export const NavbarContainer: FC<NavbarContainerProps> = ({ sketchRef, setInitSketchData }) => {
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const TitleRef = createRef<HTMLHeadingElement>();
  const ExploreRef = createRef<HTMLHeadingElement>();

  const [title, setTitle] = useState('the Wikiverse')

  useEffect(() => {
    transitionHeaderTitleText(TitleRef, ExploreRef, setTitle, meetsMinScreenSizeReq, sketchRef)
  }, [sketchRef, meetsMinScreenSizeReq, ExploreRef, TitleRef])


  return (
    <nav id={ID('container')}>
      <div id={ID('layout')}>
        <header id={ID('header')}>
          <h1 id={ID('title-text')} ref={TitleRef}>{title}</h1>
          <h1 id={ID('explore-text')} ref={ExploreRef}>explore</h1>
        </header>
          {sketchRef && <ReSearchInput {...{ sketchRef, setInitSketchData }} />}
          {sketchRef && <SketchDetailsSummary {...{ sketchRef }} />}
          {sketchRef && <SettingsOpenIndicator {...{ sketchRef }} />}
      </div>
    </nav>)
}
