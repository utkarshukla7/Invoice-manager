import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Auth0ProviderWithConfig from './auth0-provider';
import 'bootstrap/dist/css/bootstrap.min.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Auth0ProviderWithConfig>
      <App />
    </Auth0ProviderWithConfig>
  </BrowserRouter>

);


