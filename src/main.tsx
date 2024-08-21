// import './styles/Global.css'
// import './styles/Fonts.css'
import ReactDOM from 'react-dom/client'
import { WikiverseApp } from './app/WikiverseApp'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WikiverseApp apiStatusRes={{ code: 200, message: "Ok" }} />
)
