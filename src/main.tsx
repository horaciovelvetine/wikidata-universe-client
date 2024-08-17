// import './styles/Global.css'
// import './styles/Fonts.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WikiverseApp } from './app/WikiverseApp'
import { getApiStatus } from './api'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WikiverseApp apiStatusRes={await getApiStatus()} />
  </React.StrictMode>
)
