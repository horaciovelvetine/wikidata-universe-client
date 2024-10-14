import './MainQuerySessionInputStyle.css'
import '../animations/_RotateElement.css'
import '../animations/_SlowGlobeRotation.css'

import GlobeLogo from '../../assets/imgs/globe-outline-no-bg-white.svg'
import { Search, Fetch } from '../../assets/icons';

import { FC, Dispatch, createRef, useEffect, useState, SetStateAction } from 'react';

import { INPUT_STATE, RequestResponse, SessionSettingsState } from '../../interfaces';
import { getQueryData } from '../../api';
import { hideElementAndRemoveDisplay, shakeInvalidElement, showHideElement } from '../animations';

interface MainQuerySessionInputProps {
  setQuerySessionData: Dispatch<SetStateAction<RequestResponse>>,
  setActiveQuerySession: Dispatch<SetStateAction<boolean>>
  sessionSettingsState: SessionSettingsState
}

export const MainQuerySessionInput: FC<MainQuerySessionInputProps> = ({ setActiveQuerySession, setQuerySessionData, sessionSettingsState }) => {
  const [input, setInput] = useState<string>('');
  const [inputState, setInputState] = useState<INPUT_STATE>(INPUT_STATE.PLACEHOLDER);
  const { isLoading, setIsLoading } = sessionSettingsState;
  // Refs
  const containerRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  const submitRef = createRef<HTMLButtonElement>();
  const errNoticeRef = createRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      showHideElement(containerRef.current!, true, "0.35");
    }, 1);
  }, []);

  const inputIsValid = (state: INPUT_STATE) => {
    return state === INPUT_STATE.VALID;
  };

  const getCurrentRefs = () => {
    return { input: inputRef.current!, submit: submitRef.current!, cont: containerRef.current!, err: errNoticeRef.current! }

  }

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const eles = getCurrentRefs();

    if (!inputIsValid(inputState)) {
      shakeInvalidElement(eles.input)
      shakeInvalidElement(eles.submit)
      return;
    }

    setIsLoading(true);

    const response = await getQueryData(input)

    if (response.status != 200) {
      showHideElement(eles.err, true, "0.15")
      setTimeout(() => {
        showHideElement(eles.err, false, "0.15")
      }, 2000)
      shakeInvalidElement(eles.input)
      shakeInvalidElement(eles.submit)
      setIsLoading(false);
      setInputState(INPUT_STATE.INVALID);
      return;
    }
    setActiveQuerySession(true);
    setQuerySessionData(response);
    hideElementAndRemoveDisplay(eles.cont, "0.75s")
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
            {isLoading ? fetchingButton() : searchButton()}
          </form>
        </div>
      </div>
    </>
  );
};
