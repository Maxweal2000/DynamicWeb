import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

if ("serviceWorker" in navigator) {
window.addEventListener("load", () => {
navigator.serviceWorker
.register("./service-worker.js")
.then((registration) => {
console.log("Service Worker registered! Scope: ", registration.scope);
})
.catch((err) => {
console.log("Service Worker registration failed: ", err);
});
});
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

