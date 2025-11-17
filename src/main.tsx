import { createRoot } from 'react-dom/client'
import './styles/app.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { HeadProvider } from 'react-head'

createRoot(document.getElementById('root')!).render(
  <HeadProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HeadProvider>,
)
