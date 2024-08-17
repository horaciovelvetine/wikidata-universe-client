import '../styles/components/ActiveQueryControls.css'
import '../styles/animations/FetchButtonRotation.css'
import SearchIcon from '../assets/img/mi-search-icon.svg'
import ChevMenuIcon from '../assets/img/mi-chev-right-icon.svg'
import LoadingIcon from '../assets/img/mi-sync-arrows-icon.svg'

import React, { useEffect, useState } from 'react';
import { fadeInElement, shakeElement, rotateChevIcon, toggleCurSelVertexInfoDisplay } from '../functions';
import { INPUT_STATES } from './_MainQueryInput';
import { getInitQueryDataRequest } from '../api';
import { Vertex } from './_p5'


interface ActiveQueryControlsProps {
  currentQuery: string;
  curSelVertex: Vertex | undefined;
}

export const ActiveQueryControls: React.FC<ActiveQueryControlsProps> = ({ currentQuery, curSelVertex }) => {
  const [query, setQuery] = useState(currentQuery)
  const [queryState, setQueryState] = useState<INPUT_STATES>(INPUT_STATES.PLACEHOLDER);
  const [isFetching, setIsFetching] = useState(false);
  const [infoDisOpen, setInfoDisOpen] = useState(curSelVertex ? true : false);

  const containerRef = React.createRef<HTMLDivElement>();
  const inputRef = React.createRef<HTMLInputElement>();
  const submitRef = React.createRef<HTMLButtonElement>();
  const toggleRef = React.createRef<HTMLButtonElement>();
  const curSelVertDispRef = React.createRef<HTMLUListElement>();

  //==> Animate Query Input FadeIn
  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!);
    }, 100)
  }, [])

  useEffect(() => {
    console.log('curSeleVertex() AQC: ', curSelVertex)
  }, [curSelVertex])

  // 
  // HANDLERS ==>
  const submitNewQueryHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputTR = inputRef.current!
    const submitTR = submitRef.current!

    if (queryState == (INPUT_STATES.INVALID || INPUT_STATES.PLACEHOLDER) || query.length == 0) {
      shakeElement(inputTR);
      shakeElement(submitTR)
      setQuery(currentQuery);
      return;
    }
  }

  const inputChangeValidHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setQueryState(INPUT_STATES.VALID);
    }
  }

  const handleCurSelToggleClick = () => {
    setInfoDisOpen(!infoDisOpen);
    rotateChevIcon(toggleRef.current!, infoDisOpen);
    toggleCurSelVertexInfoDisplay(curSelVertDispRef.current!, infoDisOpen)
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

        <div id='aqc-cur-sel-container' >
          <button id='aqc-cur-sel-toggle' ref={toggleRef} onClick={handleCurSelToggleClick}>
            <img id='aqc-cur-sel-icon' src={ChevMenuIcon} alt='small chevron facing the bottom of the screen' />
          </button>

          <div id='aqm-cur-sel-container'>
            <ul id='aqm-cur-sel-list' ref={curSelVertDispRef}>
              <li><a href={'https://en.wikipedia.org/wiki/' + curSelVertex?.label.replace(" ", "_")} target='_blank'>{curSelVertex?.label}</a></li>
              <li>{curSelVertex?.description}</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};