import './styles.css';

import { IGetAPIStatusResponse } from './interfaces';
import { P5SketchMain } from './components';


function App({ apiStatus }: { apiStatus: IGetAPIStatusResponse }) {

  return (
    <>
      <P5SketchMain />
      <p>Current API Status: {apiStatus.status}</p>
    </>
  );
}


export default App