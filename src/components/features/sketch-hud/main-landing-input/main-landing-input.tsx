import './main-landing-input.css'
import { createRef, Dispatch, FC, FormEvent, SetStateAction, useEffect } from "react"

import { Search, SearchDngr } from '../../../../assets/icons';
import { WikiverseServiceResponse, useWikiverseService } from '../../../../app';
import { errorToggleIconVisibility, errorShakeMainLandingButton, errorShakeMainLandingInput, hideMainLandingInput, showHideMainLandingInput } from '../..';

const ID = (sufx: string) => `main-landing-${sufx}`;
const WIKIDATA_HOMEPAGE = 'https://www.wikidata.org/wiki/Wikidata:Main_Page';

interface MainLandingInputProps {
  setInitSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

export const MainLandingInput: FC<MainLandingInputProps> = ({ setInitSketchData }) => {
  const { isOnline, getQueryData } = useWikiverseService();

  //==> Elements
  const containerRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  const buttonRef = createRef<HTMLButtonElement>();
  const iconRef = createRef<HTMLImageElement>();
  const dngrIconRef = createRef<HTMLImageElement>();

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const container = containerRef.current
    if (!container) return;
    if (!inputRef.current) return;
    const curInp = inputRef.current
    if (curInp.value === '') { // no query value provided error shake...
      errorToggleIconVisibility(iconRef, dngrIconRef);
      errorShakeMainLandingButton(buttonRef);
      errorShakeMainLandingInput(inputRef);
      return;
    }

    await getQueryData(curInp.value) // we're getting new stuff...
      .then(res => {
        setInitSketchData(res);
        hideMainLandingInput(container);
      }).catch(() => { // the new stuff was no good...
        errorToggleIconVisibility(iconRef, dngrIconRef);
        errorShakeMainLandingButton(buttonRef);
        errorShakeMainLandingInput(inputRef);
      })
  }

  useEffect(() => { // hide if API Service is offline...
    showHideMainLandingInput(containerRef, isOnline);
  }, [isOnline, containerRef])

  return (
    <div id={ID('container')} ref={containerRef}>
      <h1 id={ID('title')}>Explore <a id={ID('wikidata-link')} href={WIKIDATA_HOMEPAGE} target='_blank'>Wikipedia</a> in 3D</h1>
      <form id={ID('form')} onSubmit={handleSearchSubmit}>
        <input id={ID('input')} type="text" placeholder="Search..." autoFocus={true} ref={inputRef} />
        <button id={ID('search-submit')} type='submit' ref={buttonRef}>
          <img id={ID('search-icon-dngr')} src={SearchDngr} ref={dngrIconRef} />
          <img id={ID('search-icon')} src={Search} ref={iconRef} />
        </button>
      </form>
    </div>
  )
}