import './styles.css';

import { IGetAPIStatusResponse } from './interfaces';
import { InitialQueryInput, P5SketchMain, RelatedLinksInfobox } from './components';
import { useState, useCallback, memo } from 'react';

import { getInitialQueryRequest } from './api';

interface IAppProps {
  apiStatus: IGetAPIStatusResponse;
}

interface IAppProps {
  apiStatus: IGetAPIStatusResponse;
}

const MemoizedSketch = memo(P5SketchMain); //memoized sketch prevents re-rendering of sketch when unrelated state changes

function App({ apiStatus }: IAppProps) {
  const [initialQuery, setInitialQuery] = useState<string>("");
  const [graphData, setGraphData] = useState<any>(null);

  const showInitQuery = () => {
    return initialQuery === "" ? true : false;
  }

  const handleQuerySubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>, query: string) => {
    e.preventDefault();
    setInitialQuery(query);
    const response = await getInitialQueryRequest({ query });
    // console.log('App.tsx: handleQuerySubmit()' + initialQuery);
    debugger;



    // console.log('App.tsx: handleQuerySubmit()' + initialQuery);
  }, []);

  return (
    <>
      <div id='app-layout-container'>
        <InitialQueryInput showInitQuery={showInitQuery()} handleQuerySubmit={handleQuerySubmit} />
        <div id='sketch-layout-container'>
          <MemoizedSketch />
        </div>
        <RelatedLinksInfobox apiStatus={apiStatus} />
      </div>
    </>
  );
}

export default App