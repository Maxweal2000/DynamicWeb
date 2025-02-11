import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { useState, useEffect } from 'react';
import App from './App.jsx'


function App() {

  //console.log(localstorage)
  const [items, setItems] = useState()

  useEffect(() => {
    localStorage.storage
    console.log(items)
  }, [items])


  return (
    <div>


    </div>
  )


}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
