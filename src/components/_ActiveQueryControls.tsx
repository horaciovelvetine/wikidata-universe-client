import '../styles/components/ActiveQueryControls.css'
import '../styles/animations/FetchButtonRotation.css'
import SearchIcon from '../assets/img/mi-search-icon.svg'
import ChevMenuIcon from '../assets/img/mi-chev-right-icon.svg'
import LoadingIcon from '../assets/img/mi-sync-arrows-icon.svg'

import React, { MouseEventHandler, useEffect, useState } from 'react';
import { fadeInElement, shakeElement, rotateMenuIcon, toggleMenuOptionVisibility } from '../functions';
import { INPUT_STATES } from './_MainQueryInput';
import { getInitQueryDataRequest } from '../api';


interface ActiveQueryControlsProps {
  currentQuery: string;
}

export const ActiveQueryControls: React.FC<ActiveQueryControlsProps> = ({ currentQuery }) => {
  const [query, setQuery] = useState(currentQuery)
  const [queryState, setQueryState] = useState<INPUT_STATES>(INPUT_STATES.PLACEHOLDER);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const containerRef = React.createRef<HTMLDivElement>();
  const inputRef = React.createRef<HTMLInputElement>();
  const submitRef = React.createRef<HTMLButtonElement>();
  const toggleRef = React.createRef<HTMLButtonElement>();
  const optionsRef = React.createRef<HTMLUListElement>();


  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!);
    }, 100)
  }, [])

  const submitNewQueryHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputTR = inputRef.current!
    const submitTR = submitRef.current!

    if (queryState == INPUT_STATES.INVALID) {
      shakeElement(inputTR);
      shakeElement(submitTR)
      return;
    }

    setIsFetching(true);
    // const response = await getInitQueryDataRequest({ queryVal: query })
    // if (response.status.code != 200) {
    //TODO: uh bad response
    // }
    //TODO: yay good response
  }

  const inputChangeValidHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setQueryState(INPUT_STATES.VALID);
    } else {
      setQueryState(INPUT_STATES.INVALID);
    }
  }

  const toggleMenuOpenHandler: MouseEventHandler<HTMLButtonElement> = () => {
    setMenuIsOpen(!menuIsOpen);
    rotateMenuIcon(toggleRef.current!, menuIsOpen);
    toggleMenuOptionVisibility(optionsRef.current!, menuIsOpen)
  }

  const searchButton = () => {
    return (
      <><button id='aqc-submit' ref={submitRef} type='submit'>
        <div id='icon-adjustment-layer'>
          < img id='aqc-icon' src={SearchIcon} />
        </div >
      </button></>);
  }

  const fetchingButton = () => {
    return (
      <><button id='aqc-fetch-submit' ref={submitRef} type='button'>
        <div id='icon-adjustment-layer'>
          < img id='aqc-fetch-icon' src={LoadingIcon} />
        </div>
      </button></>);
  }

  return (
    <div id='aqc-container' ref={containerRef}>
      <div id='aqc'>
        <form id='aqc-form' onSubmit={submitNewQueryHandler}>
          <input id='aqc-input' ref={inputRef} type='text' value={query} onChange={inputChangeValidHandler}></input>
          {isFetching ? fetchingButton() : searchButton()}
        </form>
        <div id='aqc-options-container' >
          <button id='aqc-options-toggle' ref={toggleRef} onClick={toggleMenuOpenHandler}>
            <img id='aqc-options-icon' src={ChevMenuIcon} alt='small chevron facing the bottom of the screen' />
          </button>
          <div id='active-query-menu-options-container'>
            <ul id='active-query-menu-options-list' ref={optionsRef}>
              <li>Test Element</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};