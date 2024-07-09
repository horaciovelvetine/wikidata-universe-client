import './styles/index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { getApiStatusRequest } from './api' // status check message for connection to API

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App apiStatus={await getApiStatusRequest()} />
  </React.StrictMode>,
)
