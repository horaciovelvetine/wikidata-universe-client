import '../styles/components/MainQueryInput.css';
import '../styles/animations/SlowGlobeRotation.css';
import '../styles/animations/FetchButtonRotation.css'
import SearchIcon from '../assets/img/mi-search-icon.svg';
import GlobeLogo from '../assets/img/globe-outline-no-bg-white.svg';
import LoadingIcon from '../assets/img/mi-sync-arrows-icon.svg'

import React, { useState, useEffect } from 'react';
import { fadeInElement, fadeOutElement, shakeElement, animFadeOutAndRemoveDisplay } from '../functions';
import { getInitQueryDataRequest } from '../api';
import { ISessionData } from '../interfaces';

interface IMainQueryInputProps {
  handleFetchSuccess: (queryInput: string, responseData: ISessionData) => void;
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
  const submitRef = React.createRef<HTMLButtonElement>();
  const errNoticeRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!, "0.25s");
    }, 1);
  }, []);

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputTR = inputRef.current!
    const submitTR = submitRef.current!
    const contTR = containerRef.current!
    const errTR = errNoticeRef.current!;

    if (!inputIsValid(inputState)) {
      shakeElement(inputTR)
      shakeElement(submitTR)
      return;
    }
    setIsFetching(true);
    const response = await getInitQueryDataRequest({ queryVal: input })

    if (response.status.code != 200) {
      fadeInElement(errTR, "0.15s")
      setTimeout(() => {
        fadeOutElement(errTR);
      }, 2000)
      shakeElement(inputTR)
      shakeElement(submitTR)
      setIsFetching(false);
      setInputState(INPUT_STATES.INVALID);
      return;
    }

    setIsFetching(false);
    handleFetchSuccess(input, response.data);
    animFadeOutAndRemoveDisplay(contTR, "0.75s")
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
      <><button id='mq-submit' ref={submitRef} type='submit'>
        <div id='icon-adjustment-layer'>
          < img id='mq-icon' src={SearchIcon} />
        </div >
      </button></>);
  }

  const fetchingButton = () => {
    return (
      <><button id='mq-fetch-submit' ref={submitRef} type='button'>
        <div id='icon-adjustment-layer'>
          < img id='mq-fetch-icon' src={LoadingIcon} />
        </div>
      </button></>);
  }

  return (
    <>
      <div id='mq-container' ref={containerRef}>
        <div id='mq-invalid-container' ref={errNoticeRef}>
          <p id='mq-invalid-message'>
            Unable to find any results for: "{input}".
          </p>
        </div>
        <div>
          <div id='mq-glogo-container'>
            <img id='mq-glogo' src={GlobeLogo} alt="Wikipedia's globe logo" />
          </div>
          <p id='mq-subtitle'>explore <a id='wikidata-homepage-link' href='https://www.wikidata.org/wiki/Wikidata:Main_Page' target='_blank'>Wikidata</a> graphically</p>
        </div>
        <div id='mq-form-container'>
          <form id='mq-form' onSubmit={formSubmitHandler}>
            <input id='mq-input' ref={inputRef} type="text" placeholder={input} onChange={inputChangeHandler} />
            {isFetching ? fetchingButton() : searchButton()}
          </form>
        </div>
      </div>
    </>
  );
};
