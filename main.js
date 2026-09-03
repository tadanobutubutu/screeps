const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// New function to add aria-label to an element (combines both versions)
const addAriaLabel = (element, label) => {
  if (element) {
    if (element.ariaLabel) {
      element.ariaLabel = label;
    } else {
      element.setAttribute('aria-label', label);
    }
  }
  return element;
}

// ... (rest of the file follows the original structure)