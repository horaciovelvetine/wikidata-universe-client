import './_ActiveQueryControlsStyle.css';
import './animations/_HorizontalShake.css';
import React, { createRef, useEffect, useState } from 'react';
import { INPUT_STATE, SketchData } from '../interfaces';
import { Search, SearchDngr, Fetch } from '../assets/icons';
import { flashOverlayElement, shakeInvalidElement } from './animations';
import { getQueryData } from '../api';


interface ActiveQueryControlsProps {
  curQuery: string;
  setCurQuery: React.Dispatch<React.SetStateAction<string>>
  setSketchData: React.Dispatch<React.SetStateAction<SketchData>>
}

export const ActiveQueryControls: React.FC<ActiveQueryControlsProps> = ({ curQuery, setCurQuery, setSketchData }) => {
  const [input, setInput] = useState<string>(curQuery);
  const [inputState, setInputState] = useState<INPUT_STATE>(INPUT_STATE.DEFAULT);
  const [fetching, setFetching] = useState(false);

  const contRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  const submitRef = createRef<HTMLButtonElement>();
  const iconRef = createRef<HTMLImageElement>();
  const iconDngrRef = createRef<HTMLImageElement>();

  function handleInputChanges(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    if (curQuery == e.target.value) {
      setInputState(INPUT_STATE.DEFAULT);
    } else if (e.target.value.length == 0) {
      setInputState(INPUT_STATE.EMPTY);
    } else if (e.target.value.length > 0) {
      setInputState(INPUT_STATE.VALID)
    } else {
      setInputState(INPUT_STATE.INVALID)
    }
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

    if (inputState === INPUT_STATE.VALID) {
      setFetching(true);
      const res = await getQueryData(input!)
      setFetching(false);
      if (res.status == 200) {
        setSketchData(res.data as SketchData)
        setCurQuery(input)
      }
    } else {
      shakeInvalidElement(els.cont);
      shakeInvalidElement(els.input);
      flashOverlayElement(els.iconDng, els.icon, 820);
      shakeInvalidElement(els.submit);
    }
  }


  const dynamicButton = () => {
    return (
      <button id='aqc-query-submit' type='submit' onClick={(e) => handleQuerySubmit(e)} ref={submitRef}>
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
        <input id='aqc-query-input' type='text' value={input} onChange={(e) => handleInputChanges(e)} ref={inputRef} />
        {dynamicButton()}
      </form>
    </div>
  );
};

