import '../styles/components/MainQueryInput.css';
import '../styles/animations/SlowGlobeRotation.css';
import '../styles/animations/FetchButtonRotation.css'
import SearchIcon from '../assets/img/mi-search-icon.svg';
import GlobeLogo from '../assets/img/globe-outline-no-bg-white.svg';
import LoadingIcon from '../assets/img/mi-sync-arrows-icon.svg'

import React, { useState, useEffect, memo } from 'react';
import { fadeInElement, fadeOutElement, shakeElement } from '../functions';
import { getInitQueryDataRequest } from '../api';
import { AnimFadeOutAndRemoveDisplay } from '../functions/_AnimFadeOutAndRemoveDisplay';
import { IWikidataUniverseSession } from '../interfaces';

interface IMainQueryInputProps {
  handleFetchSuccess: (queryInput: string, responseData: IWikidataUniverseSession) => void;
}

export enum INPUT_STATES { INVALID, VALID, PLACEHOLDER }
const inputIsValid = (state: INPUT_STATES) => {
  return state === INPUT_STATES.VALID;
};

export const MainQueryInput: React.FC<IMainQueryInputProps> = ({ handleFetchSuccess }) => {
  const [input, setInput] = useState<string>('Search...');
  const [inputState, setInputState] = useState<INPUT_STATES>(INPUT_STATES.PLACEHOLDER);
  const [isFetching, setIsFetching] = useState(false);
  const containerRef = React.createRef<HTMLDivElement>();
  const inputRef = React.createRef<HTMLInputElement>();
  const submitButtonRef = React.createRef<HTMLButtonElement>();
  const errNoticeRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!, "0.3s");
    }, 1);
  }, []);

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputTR = inputRef.current!
    const submitTR = submitButtonRef.current!
    const contTR = containerRef.current!
    const errTR = errNoticeRef.current!;

    if (!inputIsValid(inputState)) {
      shakeElement(inputTR)
      shakeElement(submitTR)
      return;
    }
    setIsFetching(true);
    const initResponse = await getInitQueryDataRequest({ queryVal: input })
    if (initResponse.status.code != 200) {
      fadeInElement(errTR, "0.25s")
      setTimeout(() => {
        fadeOutElement(errTR);
      }, 2000)
      // setInputState(INPUT_STATES.INVALID);
      shakeElement(inputTR)
      shakeElement(submitTR)
      setIsFetching(false);
      setInputState(INPUT_STATES.INVALID);
      return;
    }
    setTimeout(() => {
      setIsFetching(false);
    }, 1000)
    AnimFadeOutAndRemoveDisplay(contTR, "0.5s")
    handleFetchSuccess(input, initResponse.data);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setInput(e.target.value);
    if (e.target.value === 'Search...') {
      setInputState(INPUT_STATES.PLACEHOLDER);
      return
    } else if (e.target.value.length === 0) {
      setInputState(INPUT_STATES.INVALID);
      return
    } else if (e.target.value.length > 0) {
      setInputState(INPUT_STATES.VALID);
      setInput(e.target.value);
    }
  };

  const searchButton = () => {
    return (
      <><button id='main-query-submit' ref={submitButtonRef} type='submit'>
        <div id='icon-adjustment-layer'>
          < img id='main-query-icon' src={SearchIcon} />
        </div >
      </button></>);
  }

  const fetchingButton = () => {
    return (
      <><button id='main-fetch-submit' ref={submitButtonRef} type='button'>
        <div id='icon-adjustment-layer'>
          < img id='main-fetch-icon' src={LoadingIcon} />
        </div>
      </button></>);
  }

  return (
    <>
      <div id='main-query-container' ref={containerRef}>
        <div id='main-query-invalid-container' ref={errNoticeRef}>
          <p id='main-query-invalid-message'>
            Unable to find any results for: "{input}".
          </p>
        </div>
        <div>
          <div id='main-query-glogo-container'>
            <img id='main-query-glogo' src={GlobeLogo} alt="Wikipedia's globe logo" />
          </div>
          <p id='main-query-subtitle'>explore <a id='wikidata-homepage-link' href='https://www.wikidata.org/wiki/Wikidata:Main_Page' target='_blank'>Wikidata</a> graphically</p>
        </div>
        <div id='main-query-form-container'>
          <form id='main-query-form' onSubmit={formSubmitHandler}>
            <input id='main-query-input' ref={inputRef} type="text" placeholder={input} onChange={inputChangeHandler} />
            {isFetching ? fetchingButton() : searchButton()}
          </form>
        </div>
      </div>
    </>
  );
};
