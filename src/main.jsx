import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import './index.css';


// Here in this project, instead of creating a global CSS (like we did until now), we will use CSS module.
// Each component will have its own independent CSS file

/* But along with CSS module for specific component, we will also use Global CSS (just like we did all the time) */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
