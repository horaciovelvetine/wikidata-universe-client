import ReactDOM from 'react-dom/client'
import { getApiStatus } from './api'
import { MainAppLayout } from './app/MainAppLayout'

getApiStatus().then(apiStatusResponse => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <MainAppLayout apiStatusResponse={apiStatusResponse} />
  );
});
