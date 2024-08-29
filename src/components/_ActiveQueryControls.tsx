import './_ActiveQueryControlsStyle.css';
import './animations/_HorizontalShake.css';
import React, { createRef, useEffect, useState } from 'react';
import { INPUT_STATE, SessionData } from '../interfaces';
import { Search, SearchDngr, Fetch } from '../assets/icons';
import { flashOverlayElement, shakeInvalidElement } from './animations';
import { inputStateFromValue, queryIsSuccess, inputIsUseable } from './util';
import { getQueryData } from '../api';


interface ActiveQueryControlsProps {
  query: string | undefined;
}

export const ActiveQueryControls: React.FC<ActiveQueryControlsProps> = ({ query }) => {
  const [input, setInput] = useState<string | undefined>(query);
  const [inputState, setInputState] = useState<INPUT_STATE>(INPUT_STATE.DEFAULT);
  const [fetching, setFetching] = useState(false);

  const contRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  const submitRef = createRef<HTMLButtonElement>();
  const iconRef = createRef<HTMLImageElement>();
  const iconDngrRef = createRef<HTMLImageElement>();

  function handleInputChanges(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    setInputState(inputStateFromValue(e.target.value));
  }

  const currentRefs = () => {
    return {
      cont: contRef.current!, input: inputRef.current!,
      submit: submitRef.current!, icon: iconRef.current!,
      iconDng: iconDngrRef.current!,
    }
  }

  async function handleQuerySubmit(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const els = currentRefs();

    if (inputIsUseable(inputState)) {
      console.log('AQC=>SubmitHandler() todo')
      // todo - display error message from data[?]
    }
    shakeInvalidElement(els.cont);
    shakeInvalidElement(els.input);
    flashOverlayElement(els.iconDng, els.icon, 820);
    shakeInvalidElement(els.submit);
  }


  const dynamicButton = () => {
    return (
      <button id='aqc-query-submit' type='submit' onClick={handleQuerySubmit} ref={submitRef}>
        <img id='aqc-invalid-query-icon' src={SearchDngr} alt='magnifying glass search' ref={iconDngrRef} />
        {fetching ? <img id='aqc-query-fetching-icon' src={Fetch} alt='fetching data' /> :
          <>
            <img id='aqc-query-submit-icon' src={Search} alt='magnifying glass search' ref={iconRef} />
          </>}
      </button>
    );
  }

  return (
    <div id='aqc-container' ref={contRef}>
      <form id='aqc-query-form' onSubmit={handleQuerySubmit}>
        <input id='aqc-query-input' type='text' value={input} onChange={handleInputChanges} ref={inputRef} />
        {dynamicButton()}
      </form>
    </div>
  );
};

