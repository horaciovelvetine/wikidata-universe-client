import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { getAPIStatusRequest } from './api/GetApiStatusRequest.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App apiStatus={await getAPIStatusRequest()} />
  </React.StrictMode>,
)
