import '../assets/styles/components/MainQueryInput.css';
import '../assets/styles/animations/SlowGlobeRotation.css';
import searchIcon from '../assets/img/mi-search-icon.svg';
import GlobeLogo from '../assets/img/globe-outline-no-bg-white.svg';

import React, { useState, useEffect } from 'react';
import { fadeInElement, fadeOutElement, shakeElement } from '../functions';

interface IMainQueryInputProps {
  handleQuerySubmit: (queryInput: string) => void;
}

enum INPUT_STATES { INVALID, VALID, PLACEHOLDER }

export const MainQueryInput: React.FC<IMainQueryInputProps> = ({ handleQuerySubmit }) => {
  const [input, setInput] = useState<string>('Search...');
  const [inputState, setInputState] = useState<INPUT_STATES>(INPUT_STATES.PLACEHOLDER);
  const containerRef = React.createRef<HTMLDivElement>();
  const inputRef = React.createRef<HTMLInputElement>();
  const submitButtonRef = React.createRef<HTMLButtonElement>();

  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!);
    }, 1);
  }, []);

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputState === INPUT_STATES.INVALID || inputState === INPUT_STATES.PLACEHOLDER) {
      shakeElement(inputRef.current!);
      shakeElement(submitButtonRef.current!);
      return;
    }

    fadeOutElement(containerRef.current!);
    handleQuerySubmit(input);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <img id='main-query-glogo' src={GlobeLogo} />
          </div>
          <p id='main-query-title'>wikiverse</p>
          <p id='main-query-subtitle'>Explore <a href='https://www.wikidata.org/wiki/Wikidata:Main_Page' target='_blank'>Wikidata</a> Graphically</p>
        </div>
        <div id='main-query-form-container'>
          <form id='main-query-form' onSubmit={formSubmitHandler}>
            <input id='main-query-input' ref={inputRef} type="text" placeholder={input} onChange={inputChangeHandler} />
            <button id='main-query-submit' ref={submitButtonRef} type='submit'><img id='main-query-icon' src={searchIcon} /></button>
          </form>
          <div id='main-query-infobox'><a>F.A.Q.</a></div>
        </div>
      </div>
    </>
  );
};
