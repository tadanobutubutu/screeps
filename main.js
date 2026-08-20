// main.js
import React from 'react';
import { createRoot } from 'react--dom/client';
import App from './App';

// Modify SVG elements in both layout files (line 7 in app/layout.tsx and dashboard/app/layout.tsx) to include aria-hidden="true"
document.querySelectorAll('svg').forEach((svg) => {
  const existingTitle = svg.querySelector('title');
  if (!existingTitle) {
    const desc = svg.getAttribute('alt') || 'Graphic';
    const title = document.createElement('title');
    title.textContent = desc;
    svg.insertBefore(title, svg.firstChild);
    svg.setAttribute('aria-hidden', 'true');
  }
});

// Apply accessibility improvements for hash-only links to ensure keyboard and screen reader compatibility
function applyAccessibilityFixes() {
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEvent