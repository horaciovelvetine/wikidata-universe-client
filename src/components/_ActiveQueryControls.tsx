import './_ActiveQueryControlsStyle.css';
import React, { createRef, useEffect, useState } from 'react';
import { eInputState } from '../interfaces';
import Search from '../assets/icons/mi-search-icon.svg';
import Fetch from '../assets/icons/mi-sync-arrows-icon.svg';

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

  useEffect(() => { }, []);

  function handleInputChanges(e: React.ChangeEvent<HTMLInputElement>) {
    const prev = query;
    const val = e.target.value;
    setQuery(val);
    if (val == prev) {
      return;
    } else if (val.length == 0) {
      setInput(eInputState.EMPTY);
    } else if (val.length > 0) {
      setInput(eInputState.VALID);
    } else if (val == "Search...") {
      setInput(eInputState.PLACEHOLDER);
    } else {
      setInput(eInputState.INVALID);
    }
  }

  function handleQuerySubmit(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    switch (input) {
      case eInputState.VALID:
        //locally validate if query matches another vertex, then fetch
        break;
      case eInputState.DEFAULT:
        //same as component first render
        break;
      case eInputState.INVALID:
      case eInputState.EMPTY:
      case eInputState.PLACEHOLDER:
        //invalid shake & danger inputs
        break;

      default:
        break;
    }
  }

  return curQuery == undefined ? <></> : (
    <div id='aqc-container' ref={contRef}>
      <form id='aqc-query-form' onSubmit={handleQuerySubmit}>
        <input id='aqc-query-input' type='text' value={query} onChange={handleInputChanges} ref={inputRef} />
        <button id='aqc-query-submit' type='submit' onClick={handleQuerySubmit} ref={submitRef}>
          <img id='aqc-query-submit-icon' src={fetching ? Fetch : Search} alt='magnifying glass search' ref={iconRef} />
        </button>
      </form>
    </div>
  );
};

