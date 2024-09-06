import ReactDOM from 'react-dom/client'
import { getQueryData } from './api'
import { MainAppLayout } from './app/MainAppLayout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MainAppLayout demoInitQueryRes={await getQueryData("Richard Hammond")} />
)
