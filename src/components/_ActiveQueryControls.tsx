import './_ActiveQueryControlsStyle.css';
import './animations/_HorizontalShake.css';
import React, { createRef, useEffect, useState } from 'react';
import { eInputState, SessionData } from '../interfaces';
import { Search, SearchDngr, Fetch } from '../assets/icons';
import { flashOverlayElement, shakeInvalidElement } from './animations';
import { inputStateFromValue, queryIsSuccess, inputIsUseable } from './util';
import { getQueryData } from '../api';


interface ActiveQueryControlsProps {
  curQuery: string | undefined;
  camFocusHandler: (target: string) => boolean;
  newQueryHandler: (data: SessionData) => void;
}

export const ActiveQueryControls: React.FC<ActiveQueryControlsProps> = ({ curQuery, camFocusHandler, newQueryHandler }) => {
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

    if (inputIsUseable(input)) {
      const tgtInExistingSet = camFocusHandler(query!);
      if (tgtInExistingSet) return; //already in set, no need to fetch

      setFetching(true);
      const res = await getQueryData(query!);
      setFetching(false);
      if (queryIsSuccess(res)) {
        console.log(res)
        newQueryHandler(res.data as SessionData);
        return;
      }
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
        <input id='aqc-query-input' type='text' value={query} onChange={handleInputChanges} ref={inputRef} />
        {dynamicButton()}
      </form>
    </div>
  );
};

