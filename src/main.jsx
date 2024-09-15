import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'

import 'rsuite/dist/rsuite.min.css' 
import 'bootstrap/dist/css/bootstrap.css';
import './assets/scss/style.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-loading-skeleton/dist/skeleton.css'; // style react-loading-skeleton https://www.npmjs.com/package/react-loading-skeleton

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
)
