import './assets/styles/Global.css'
import './assets/styles/Fonts.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RootLayout } from './layouts/_RootLayout'
import { getApiStatusRequest } from './api' // status check needed API's


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootLayout apiStatus={await getApiStatusRequest()} />
  </React.StrictMode>,
)
