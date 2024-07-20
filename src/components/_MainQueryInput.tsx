import React, { useState, useEffect } from 'react';
import searchIcon from '../assets/img/mi-search-icon.svg';
import { DISPLAY_STATES } from '../interfaces/';
import { DynamicDisplayStateMap } from '../functions/';

interface IMainQueryInputProps {
  handleQuerySubmit: (queryInput: string, setQueryInput: React.Dispatch<React.SetStateAction<string>>) => void;
}

export const MainQueryInput: React.FC<IMainQueryInputProps> = ({ handleQuerySubmit }) => {
  const [queryInput, setQueryInput] = useState<string>('Search Wikipedia...');
  const [displayState, setDisplayState] = useState<DISPLAY_STATES>(DISPLAY_STATES.HIDDEN);

  useEffect(() => {
    setTimeout(() => {
      setDisplayState(DISPLAY_STATES.SHOWN);
    }, 1);
  }, []);

  const passQuerySubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisplayState(DISPLAY_STATES.HIDDEN);
    setTimeout(() => {
      setDisplayState(DISPLAY_STATES.REMOVED);
    }, 500);
    handleQuerySubmit(queryInput, setQueryInput);
  };



  return (
    <div id='initial-query-container' className={`${DynamicDisplayStateMap[displayState]}`}>
      <div id='initial-query-form-container'>
        <form id='initial-query-form' onSubmit={passQuerySubmitHandler}>
          <input id='initial-query-input' type="text" placeholder={queryInput} onChange={(e) => setQueryInput(e.target.value)} />
          <button id='initial-query-submit' type='submit'><img id='init-query-icon' src={searchIcon} /></button>
        </form>
        <div id='init-query-infobox'><a>F.A.Q.</a></div>
      </div>
    </div>
  );
};
