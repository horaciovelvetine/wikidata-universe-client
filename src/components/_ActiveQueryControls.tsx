import '../styles/components/ActiveQueryControls.css'
import React, { useEffect, useState } from 'react';
import { fadeInElement, shakeElement } from '../functions';
import SearchIcon from '../assets/img/mi-search-icon.svg'
import { INPUT_STATES } from './_MainQueryInput';


interface ActiveQueryControlsProps {
  currentQuery: string;
}

export const ActiveQueryControls: React.FC<ActiveQueryControlsProps> = ({ currentQuery }) => {
  const [query, setQuery] = useState(currentQuery)
  const [queryState, setQueryState] = useState<INPUT_STATES>(INPUT_STATES.VALID);
  const containerRef = React.createRef<HTMLDivElement>();
  const inputRef = React.createRef<HTMLInputElement>();
  const submitRef = React.createRef<HTMLButtonElement>();

  useEffect(() => {
    setTimeout(() => {
      fadeInElement(containerRef.current!);
    }, 100)
  }, [])

  const submitNewQueryHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (queryState == INPUT_STATES.INVALID) {
      shakeElement(inputRef.current!);
      shakeElement(submitRef.current!)
      return;
    }
    // TODO:
    console.log('NewQuery():', query);
  }

  const inputChangeValidHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setQueryState(INPUT_STATES.VALID);
    } else {
      setQueryState(INPUT_STATES.INVALID);
    }
  }

  return (
    <div id='active-query-control-container' ref={containerRef}>
      <div id='active-query-control'>
        <form id='active-query-control-form' onSubmit={submitNewQueryHandler}>
          <input id='active-query-control-input' ref={inputRef} type='text' value={query} onChange={inputChangeValidHandler}></input>
          <button id='active-query-control-submit' ref={submitRef} type='submit'><img id='active-query-control-icon' src={SearchIcon} /></button>
        </form>
      </div>
    </div>
  );
};