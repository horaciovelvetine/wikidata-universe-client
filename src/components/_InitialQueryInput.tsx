import { useDebounce } from '../hooks';
import searchIcon from '../assets/img/mi-search-icon.svg';

export interface IInitialQueryInputProps {
  query: string;
  setQuery: (query: string) => void;
}

export function InitialQueryInput({ query, setQuery }: IInitialQueryInputProps) {

  const debouncedSetQuery = useDebounce(setQuery, 250);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSetQuery(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <div id='initial-query-input-container'>
      <form onSubmit={handleSubmit}>
        <span>
          <input id='init-query-input' type="text" placeholder={query} onChange={handleInputChange} />
          <button id='init-query-submit' type='submit'><img id="init-query-icon" src={searchIcon} /></button>
        </span>
      </form>
      <div id='init-query-infobox'><i><a>Questions?</a></i></div>
    </div>
  );
};
