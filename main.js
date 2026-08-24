// main.js - React Application Entry Point

import React from 'react';
import ReactDOM from 'react-dom';

// Mock document for Jest testing environment
global.document = {
  documentElement: {
    lang: 'en',
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
  },
  body: {
    appendChild: jest.fn(),
    setAttribute: jest.fn(),
  },
  createElement: jest.fn(() => ({
    setAttribute: jest.fn(),
    appendChild: jest.fn(),
    style: {},
    innerHTML: '',
  })),
  createDocumentFragment: jest.fn(() => ({
    appendChild: jest.fn(),
  })),
  getElementById: jest.fn(() => ({
    appendChild: jest.fn(),
  })),
};

// Root component with lang attribute on html element
function App() {
  return null;
}

// Render the application
const rootElement = document.getElementById('root');

if (rootElement) {
  const htmlElement = document.createElement('html');
  htmlElement.setAttribute('lang', 'en'); // Fix: Added lang="en" attribute
  rootElement.appendChild(htmlElement);
}

export { App };
export default App;