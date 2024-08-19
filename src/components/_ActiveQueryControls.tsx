import './_ActiveQueryControlsStyle.css';
import './animations/_HorizontalShake.css';
import React, { createRef, useEffect, useState } from 'react';
import { eInputState } from '../interfaces';
import { Search, SearchDngr, Fetch } from '../assets/icons';
import { flashOverlayElement, shakeInvalidElement } from './animations';
import { inputStateFromValue, inputValueIsEmpty } from './util';

interface ActiveQueryControlsProps {
  curQuery: string | undefined;
  camFocusHandler: (target: string) => boolean;
  submitQueryHandler: (query: string) => void;
}

export const ActiveQueryControls: React.FC<ActiveQueryControlsProps> = ({ curQuery, camFocusHandler, submitQueryHandler }) => {
  const [query, setQuery] = useState(curQuery);
  const [input, setInput] = useState<eInputState>(eInputState.DEFAULT);
  const [fetching, setFetching] = useState(false);

  const contRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  const submitRef = createRef<HTMLButtonElement>();
  const iconRef = createRef<HTMLImageElement>();
  const iconDngrRef = createRef<HTMLImageElement>();

  function handleInputChanges(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setInput(inputStateFromValue(e.target.value));
  }

  function handleQuerySubmit(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (input == eInputState.VALID || input == eInputState.DEFAULT) {
      const tgtInExistingSet = camFocusHandler(query!);
      if (tgtInExistingSet) return;
      setFetching(true);
      submitQueryHandler(query!);
      setFetching(false);
      return;
    }
    shakeInvalidElement(contRef.current!);
    shakeInvalidElement(inputRef.current!);
    flashOverlayElement(iconDngrRef.current!, iconRef.current!, 820);
    shakeInvalidElement(submitRef.current!);
  }

  return curQuery == undefined ? <></> : (
    <div id='aqc-container' ref={contRef}>
      <form id='aqc-query-form' onSubmit={handleQuerySubmit}>
        <input id='aqc-query-input' type='text' value={query} onChange={handleInputChanges} ref={inputRef} />
        <button id='aqc-query-submit' type='submit' onClick={handleQuerySubmit} ref={submitRef}>
          <img id='aqc-query-submit-icon' src={fetching ? Fetch : Search} alt='magnifying glass search' ref={iconRef} />
          <img id='aqc-invalid-query-icon' src={fetching ? Fetch : SearchDngr} alt='magnifying glass search' ref={iconDngrRef} />
        </button>
      </form>
    </div>
  );
};

