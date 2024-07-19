import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WikidataUniverseAppMain } from './components'

import { getApiStatusRequest } from './api' // status check message for connection to API

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WikidataUniverseAppMain apiStatus={await getApiStatusRequest()} wikidataApiStatus='online.' />
  </React.StrictMode>,
)
