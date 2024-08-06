import '../styles/components/MainQueryInput.css';
import '../styles/animations/SlowGlobeRotation.css';
import SearchIcon from '../assets/img/mi-search-icon.svg';
import GlobeLogo from '../assets/img/globe-outline-no-bg-white.svg';

import React, { useState, useEffect } from 'react';
import { fadeInElement, shakeElement } from '../functions';

interface IMainQueryInputProps {
  handleQuerySubmit: (queryInput: string, queryInputEle: React.RefObject<HTMLDivElement>) => void;
}

export enum INPUT_STATES { INVALID, VALID, PLACEHOLDER }
const inputIsValid = (state: INPUT_STATES) => {
  return state === INPUT_STATES.VALID;
};

export const MainQueryInput: React.FC<IMainQueryInputProps> = ({ handleQuerySubmit }) => {
  const [input, setInput] = useState<string>('Search...');
  const [inputState, setInputState] = useState<INPUT_STATES>(INPUT_STATES.PLACEHOLDER);
  const containerRef = React.createRef<HTMLDivElement>();
  const inputRef = React.createRef<HTMLInputElement>();
  const submitButtonRef = React.createRef<HTMLButtonElement>();

  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!, "0.3s");
    }, 1);
  }, []);

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputIsValid(inputState)) {
      shakeElement(inputRef.current!);
      // shakeElement(iconRef.current!);a
      shakeElement(submitButtonRef.current!);
      return;
    }
    handleQuerySubmit(input, containerRef);
  };

  const inputChangeValidSetter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value === 'Search...') {
      setInputState(INPUT_STATES.PLACEHOLDER);
    } else if (e.target.value.length > 0) {
      setInputState(INPUT_STATES.VALID);
    } else {
      setInputState(INPUT_STATES.INVALID);
    }
  };

  return (
    <>
      <div id='main-query-container' ref={containerRef}>
        <div>
          <div id='main-query-glogo-container'>
            <img id='main-query-glogo' src={GlobeLogo} alt="Wikipedia's globe logo" />
          </div>
          <p id='main-query-title'>wikiverse</p>
          <p id='main-query-subtitle'>Explore <a href='https://www.wikidata.org/wiki/Wikidata:Main_Page' target='_blank'>Wikidata</a> Graphically</p>
        </div>
        <div id='main-query-form-container'>
          <form id='main-query-form' onSubmit={formSubmitHandler}>
            <input id='main-query-input' ref={inputRef} type="text" placeholder={input} onChange={inputChangeValidSetter} />
            <button id='main-query-submit' ref={submitButtonRef} type='submit'><img id='main-query-icon' src={SearchIcon} /></button>
          </form>
        </div>
      </div>
    </>
  );
};
