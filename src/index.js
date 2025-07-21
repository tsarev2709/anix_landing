/* global process */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import NotFound from './components/NotFound';

const root = ReactDOM.createRoot(document.getElementById('root'));
const base = process.env.PUBLIC_URL || '';
const relativePath = window.location.pathname.replace(base, '') || '/';

if (relativePath === '/' || relativePath === '/index.html') {
  root.render(<App />);
} else {
  root.render(<NotFound />);
}