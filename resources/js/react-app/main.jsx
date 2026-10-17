import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/monochrome.css';

const container = document.getElementById('react-root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
