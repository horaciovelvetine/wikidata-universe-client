import './styles/Global.css'
import './styles/Fonts.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RootLayout } from './layouts/_Root'
import { getApiStatusRequest } from './api' // status check needed API's


ReactDOM.createRoot(document.getElementById('root')!).render(
  <RootLayout apiStatus={await getApiStatusRequest()} />
)
