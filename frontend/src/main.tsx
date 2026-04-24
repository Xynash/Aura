import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // <--- MAKE SURE THIS LINE EXISTS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)