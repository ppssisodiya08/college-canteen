/**
 * main.jsx — React Entry Point
 *
 * This is the first JavaScript file that runs in the browser.
 * It mounts the React <App /> component into the #root div in index.html.
 *
 * React 18's createRoot API enables concurrent features.
 * StrictMode runs components twice in development to help find bugs.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
