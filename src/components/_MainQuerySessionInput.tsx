import './_MainQuerySessionInputStyle.css'
import GlobeLogo from '../assets/imgs/globe-outline-no-bg-white.svg'
import { Search, Fetch } from '../assets/icons';

import React, { useEffect, useState } from 'react';

import { INPUT_STATE } from '../interfaces';
import { getQueryData } from '../api';
import { hideElementAndRemoveDisplay, shakeInvalidElement, showHideElement } from './animations';

export const MainQuerySessionInput: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [inputState, setInputState] = useState<INPUT_STATE>(INPUT_STATE.PLACEHOLDER);
  const [isFetching, setIsFetching] = useState(false);
  // Refs
  const containerRef = React.createRef<HTMLDivElement>();
  const inputRef = React.createRef<HTMLInputElement>();
  const submitRef = React.createRef<HTMLButtonElement>();
  const errNoticeRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      showHideElement(containerRef.current!, true, "0.25");
    }, 1);
  }, []);

  const inputIsValid = (state: INPUT_STATE) => {
    return state === INPUT_STATE.VALID;
  };

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputTR = inputRef.current!
    const submitTR = submitRef.current!
    const contTR = containerRef.current!
    const errTR = errNoticeRef.current!;

    if (!inputIsValid(inputState)) {
      shakeInvalidElement(inputTR)
      shakeInvalidElement(submitTR)
      return;
    }
    setIsFetching(true);

    if (input != undefined) { // TODO remove this goofy obstacle
      const response = await getQueryData(input)

      if (response.status != 200) {
        showHideElement(errTR, true, "0.15")
        setTimeout(() => {
          showHideElement(errTR, false, "0.15")
        }, 2000)
        shakeInvalidElement(inputTR)
        shakeInvalidElement(submitTR)
        setIsFetching(false);
        setInputState(INPUT_STATE.INVALID);
        return;
      }
    }

    setIsFetching(false);
    //TODO jump in success side here
    // handleFetchSuccess(input, response.data);
    hideElementAndRemoveDisplay(contTR, "0.75s")
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value == '' || e.target.value.length == 0) {
      setInputState(INPUT_STATE.EMPTY);
    } else if (e.target.value.length > 0) {
      setInputState(INPUT_STATE.VALID)
    } else {
      setInputState(INPUT_STATE.INVALID)
    }
  };

  const searchButton = () => {
    return (
      <><button id='mq-submit' ref={submitRef} type='submit'>
        <div id='icon-adjustment-layer'>
          < img id='mq-icon' src={Search} />
        </div >
      </button></>);
  }

  const fetchingButton = () => {
    return (
      <><button id='mq-fetch-submit' ref={submitRef} type='button'>
        <div id='icon-adjustment-layer'>
          < img id='mq-fetch-icon' src={Fetch} />
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
          <p id='mq-subtitle'>explore <a id='wikidata-homepage-link' href='https://www.wikidata.org/wiki/Wikidata:Main_Page' target='_blank'>Wikipedia</a> graphically</p>
        </div>
        <div id='mq-form-container'>
          <form id='mq-form' onSubmit={formSubmitHandler}>
            <input id='mq-input' ref={inputRef} type="text" placeholder="Search..." onChange={inputChangeHandler} />
            {isFetching ? fetchingButton() : searchButton()}
          </form>
        </div>
      </div>
    </>
  );
};
