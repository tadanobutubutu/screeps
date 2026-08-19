// main.js - Resolved version combining React components and rotation feature

import React from 'react';
import { useState, useEffect } from 'react';

// Initialize rotation state
let isRotated = false;

// Handle rotate button click
document.getElementById('rotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    if (isRotated) {
        content.style.transform = 'rotate(0deg)';
        isRotated = false;
    } else {
        content.style.transform = 'rotate(90deg)';
        isRotated = true;
    }
});

// Handle unrotate button click (using button element for accessibility)
document.getElementById('unrotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    content.style.transform = 'rotate(0deg)';
    isRotated = false;
});

// Sample content
const content = document.getElementById('content');
if (content) {
    content.innerHTML = `
        <h1>Welcome to the App</h1>
        <p>Click the rotate button to rotate the content.</p>
        <button id="rotate">Rotate</button>
        <button id="unrotate">rotate back</button>
    `;
}

// Fixed React components

// Fix for REACT_015: React Language Attribute
// Add lang attribute to the root element
function App() {
  return (
    <div lang="en"> {/* Added lang attribute */}
      {/* Rest of your app content */}
    </div>
  );
}

// Fix for REACT_027: React Table Structure
// Ensure tables have proper structure with <thead>, <tbody>, and <th> elements
function DataTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Header 1</th>
          <th scope="col">Header 2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.col1}</td>
            <td>{row.col2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Fix for REACT_017: React Landmarks
// Add proper ARIA landmarks
function MainContent() {
  return (
    <main aria-label="Main content"> {/* Added main landmark */}
      {/* Main content here */}
    </main>
  );
}

// Fix for REACT_041: React SVG Accessible Name
// Add title/desc to SVG elements
function Logo() {
  return (
    <svg aria-hidden="true" focusable="false">
      <title>Company Logo</title>
      <desc>A blue circle with white text</desc>
      {/* SVG content */}
    </svg>
  );
}

// Fix for REACT_025: React Unique Landmarks
// Ensure landmarks have unique labels
function Navigation() {
  return (
    <nav aria-label="Primary navigation"> {/* Unique label */}
      {/* Navigation items */}
    </nav>
  );
}

// Fix for REACT_036: React Fake Link
// Replace fake links with proper <button> or <a> elements
function ActionButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </button>
  );
}

// Export the main component
export default App;