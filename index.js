
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(App, null, null)
);
