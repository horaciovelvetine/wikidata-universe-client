import ReactDOM from 'react-dom/client'
import { getApiStatus } from './api'
import { MainAppLayout } from './app/MainAppLayout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MainAppLayout apiStatusResponse={await getApiStatus()} />
)
