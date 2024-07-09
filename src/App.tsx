import './styles/App.css'
import './styles/index.css'
import { useEffect, useState } from 'react';

import { useDebounce } from './hooks';
import { calculateDrawingDimensions } from './functions';
import { IDimensions, IGetAPIStatusResponse } from './interfaces';


function App({ apiStatus }: { apiStatus: IGetAPIStatusResponse }) {
  const [drawingSize, setDrawingSize] = useState<IDimensions>(calculateDrawingDimensions(window));
  
  const handleResizeDebounces = useDebounce(() => {
    console.log('Window size changed to:', drawingSize.width, drawingSize.height)
    setDrawingSize(calculateDrawingDimensions(window));
  }, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResizeDebounces);

    return () => {
      window.removeEventListener('resize', handleResizeDebounces);
    };
  }, [handleResizeDebounces]);

  //* COMPONENT STARTS * COMPONENT STARTS * COMPONENT STARTS * COMPONENT STARTS *
  //  COMPONENT STARTS * COMPONENT STARTS * COMPONENT STARTS * COMPONENT STARTS *
  //* COMPONENT STARTS * COMPONENT STARTS * COMPONENT STARTS * COMPONENT STARTS *

  return (
    <>
      <p>Current API Status: {apiStatus.status}</p>
    </>
  );
}


export default App