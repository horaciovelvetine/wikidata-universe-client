import React, { useState } from 'react';
import searchIcon from '../assets/img/mi-search-icon.svg';

interface IInitialQueryInputProps {
  showInitQuery: boolean;
  handleQuerySubmit: (e: React.FormEvent<HTMLFormElement>, queryInput: string) => void;
}

export const InitialQueryInput: React.FC<IInitialQueryInputProps> = ({ showInitQuery, handleQuerySubmit }) => {
  const [queryInput, setQueryInput] = useState<string>('Search Wikipedia...');

  const passQuerySubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    handleQuerySubmit(e, queryInput);
  };

  return (
    <>
      <div id='initial-query-container' className={showInitQuery ? 'show-init-query' : 'hide-init-query'}>
        <div id='initial-query-form-container'>
          <form id='initial-query-form' onSubmit={passQuerySubmitHandler}>
            <input id='initial-query-input' type="text" placeholder={queryInput} onChange={(e) => setQueryInput(e.target.value)} disabled={!showInitQuery} />
            <button id='initial-query-submit' type='submit'><img id="init-query-icon" src={searchIcon} /></button>
          </form>
          <div id='init-query-infobox'><a>F.A.Q.</a></div>
        </div>
      </div>
    </>
  );
};
