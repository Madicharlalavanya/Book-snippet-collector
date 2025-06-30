import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
//import '.HomePage.css' // or you can import styles inside HomePage.jsx

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
