import './styles/App.css'

import { get_status_response } from './api/GetApiStatusRequest'

function App({ apiStatus }: { apiStatus: get_status_response }) {

  return (
    <>
      <p>Current API Status: {apiStatus.status}</p>
    </>
  )
}

export default App
