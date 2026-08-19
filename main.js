import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const content = document.getElementById('content');
if (content) {
    content.innerHTML = `
        <h1>Welcome to the App</h1>
        <p>Click the rotate button to rotate the content.</p>
        <button id="rotate">Rotate</button>
        <button id="unrotate">rotate back</button>
    `;
}

module.exports = {
    isRotated,
    rotateContent: function() {
        const content = document.getElementById('content');
        if (content) {
            if (isRotated) {
                content.style.transform = 'rotate(0deg)';
                isRotated = false;
            } else {
                content.style.transform = 'rotate(90deg)';
                isRotated = true;
            }
        }
    },
    unrotateContent: function() {
        const content = document.getElementById('content');
        if (content) {
            content.style.transform = 'rotate(0deg)';
            isRotated = false;
        }
    }
};

const AppLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main>
        {children}
      </main>
    </React.StrictMode>
  );
};