import './_ActiveQueryControlsStyle.css';
import './animations/_HorizontalShake.css';
import React, { createRef, useEffect, useState } from 'react';
import { eInputState } from '../interfaces';
import { Search, SearchDngr, Fetch } from '../assets/icons';
import { flashOverlayElement, shakeInvalidElement } from './animations';

interface ActiveQueryControlsProps {
  curQuery: string | undefined;
}

export const ActiveQueryControls: React.FC<ActiveQueryControlsProps> = ({ curQuery }) => {
  const [query, setQuery] = useState(curQuery);
  const [input, setInput] = useState<eInputState>(eInputState.DEFAULT);
  const [fetching, setFetching] = useState(false);

  const contRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  const submitRef = createRef<HTMLButtonElement>();
  const iconRef = createRef<HTMLImageElement>();
  const iconDngrRef = createRef<HTMLImageElement>();

  useEffect(() => { }, []);

  function handleInputChanges(e: React.ChangeEvent<HTMLInputElement>) {
    const prev = query;
    setQuery(e.target.value);

    if (query == prev) {
      return;
    } else if (query!.length == 0) {
      setInput(eInputState.EMPTY);
    } else if (query!.length > 0) {
      setInput(eInputState.VALID);
    } else if (query == "Search...") {
      setInput(eInputState.PLACEHOLDER);
    } else {
      setInput(eInputState.INVALID);
    }
  }

  function handleQuerySubmit(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    switch (input) {
      case eInputState.VALID:
        console.log('searched for query', query)
        break;
      case eInputState.DEFAULT:
        console.log('searched for origin.')
        break;
      case eInputState.INVALID:
      case eInputState.EMPTY:
      case eInputState.PLACEHOLDER:
      default:
        shakeInvalidElement(contRef.current!);
        shakeInvalidElement(inputRef.current!);
        flashOverlayElement(iconDngrRef.current!, iconRef.current!, 820);
        shakeInvalidElement(submitRef.current!);
        break;
    }
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

