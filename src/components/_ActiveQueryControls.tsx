import '../styles/components/ActiveQueryControls.css'
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { fadeInElement, shakeElement, rotateMenuIcon, toggleMenuOptionVisibility } from '../functions';
import SearchIcon from '../assets/img/mi-search-icon.svg'
import ChevMenuIcon from '../assets/img/mi-chev-right-icon.svg'
import { INPUT_STATES } from './_MainQueryInput';


interface ActiveQueryControlsProps {
  currentQuery: string;
}

export const ActiveQueryControls: React.FC<ActiveQueryControlsProps> = ({ currentQuery }) => {
  const [query, setQuery] = useState(currentQuery)
  const [queryState, setQueryState] = useState<INPUT_STATES>(INPUT_STATES.VALID);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const containerRef = React.createRef<HTMLDivElement>();
  const inputRef = React.createRef<HTMLInputElement>();
  const submitRef = React.createRef<HTMLButtonElement>();
  const toggleRef = React.createRef<HTMLButtonElement>();
  const optionsRef = React.createRef<HTMLUListElement>();


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

  const toggleMenuOpenHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    setMenuIsOpen(!menuIsOpen);
    rotateMenuIcon(toggleRef.current!, menuIsOpen);
    toggleMenuOptionVisibility(optionsRef.current!, menuIsOpen)

  }

  return (
    <div id='active-query-control-container' ref={containerRef}>
      <div id='active-query-control'>
        <form id='active-query-control-form' onSubmit={submitNewQueryHandler}>
          <input id='active-query-control-input' ref={inputRef} type='text' value={query} onChange={inputChangeValidHandler}></input>
          <button id='active-query-control-submit' ref={submitRef} type='submit'><img id='active-query-control-icon' src={SearchIcon} alt='small magnifying glass icon' /></button>
        </form>
        <div id='active-query-control-options-container' >
          <button id='active-query-control-options-toggle' ref={toggleRef} onClick={toggleMenuOpenHandler}>
            <img id='active-query-control-options-icon' src={ChevMenuIcon} alt='small chevron facing the bottom of the screen' />
          </button>
          <div id='active-query-menu-options-container'>
            <ul id='active-query-menu-options-list' ref={optionsRef}>
              <li>Test Element</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};