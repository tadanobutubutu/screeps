import React, { useState } from 'react';
import { copyErr } from './utils';

function Dashboard() {
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  // ... other logic (e.g., fetchStats, etc.)

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Keep a single <main> landmark as required by REACT_025 */}
      <main>
        {error ? (
          <>
            <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
            <pre
              tabIndex={0}
              aria-label="エラーメッセージ詳細"
              style={{
                color: '#c53030',
                backgroundColor: '#fff5f5',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              {error}
            </pre>
            <button
              onClick={copyErr}
              onMouseEnter={() => setErrCopyHover(true)}
              onMouseLeave={() => setErrCopyHover(false)}
              onFocus={() => setErrCopyHover(true)}
              onBlur={() => setErrCopyHover(false)}
              aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
              title={copied ? 'コピー済み' : 'エラーをコピー'}
              style={{
                backgroundColor: copied ? '#155d27' : '#004b73',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                transform: errCopyHover ? 'scale(1.05)' : 'scale(1)',
                boxShadow: errCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                filter: errCopyHover ? 'brightness(1.1)' : 'none',
              }}
            >
              {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
            </button>
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              onMouseEnter={() => setErrRetryHover(true)}
              onMouseLeave={() => setErrRetryHover(false)}
            />
          </>
        ) : (
          <>
            {/* Use <section> for non‑main content to avoid additional landmarks */}
            <section>
              {/* Success state UI goes here */}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

// New Accessibility Improvements

/**
 * Adds proper language attribute to HTML element for screen readers
 * Fixes REACT_015: React Language Attribute
 */
function ensureLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English
  }
}

/**
 * Improves table structure for screen readers
 * Fixes REACT_027: React Table Structure
 * @param {HTMLElement} tableElement - The table element to improve
 */
function improveTableStructure(tableElement) {
  if (!tableElement) return;

  // Add proper table structure if missing
  if (!tableElement.querySelector('thead') && tableElement.querySelector('tr')) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      tableElement.insertBefore(thead, tableElement.firstChild);
    }
  }

  if (!tableElement.querySelector('tbody') && tableElement.querySelectorAll('tr')) {
    const tbody = document.createElement('tbody');
    const rows = tableElement.querySelectorAll('tr');
    if (rows.length > 0) {
      // Check if rows are already in thead (first row was moved)
      const theadElement = tableElement.querySelector('thead');
      if (theadElement && rows[0] === theadElement.querySelector('tr')) {
        // Skip the first row as it's already in thead
        for (let i = 1; i < rows.length; i++) {
          tbody.appendChild(rows[i]);
        }
      } else {
        rows.forEach(row => {
          tbody.appendChild(row);
        });
      }
      tableElement.appendChild(tbody);
    }
  }

  // Add scope attributes to headers if missing
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

/**
 * Adds proper landmarks for screen readers
 * Fixes REACT_017: React Landmarks
 */
function addLandmarks() {
  // Add main landmark if missing
  if (!document.querySelector('main') && !document.querySelector('[role="main"]')) {
    const mainContent = document.querySelector('[role="content"]') ||
                       document.querySelector('#content') ||
                       document.querySelector('.content');
    if (mainContent) {
      const mainElement = document.createElement('main');
      mainElement.setAttribute('role', 'main');
      mainContent.parentNode.insertBefore(mainElement, mainContent);
      mainElement.appendChild(mainContent);
    }
  }

  // Add navigation landmark if missing
  if (!document.querySelector('nav') && !document.querySelector('[role="navigation"]')) {
    const navContent = document.querySelector('[role="navigation"]') ||
                      document.querySelector('#nav') ||
                      document.querySelector('.nav');
    if (navContent) {
      const navElement = document.createElement('nav');
      navElement.setAttribute('aria-label', 'Main navigation');
      navContent.parentNode.insertBefore(navElement, navContent);
      navElement.appendChild(navContent);
    }
  }
}

/**
 * Adds accessible names to SVG elements
 * Fixes REACT_041: React SVG Accessible Name
 * @param {HTMLElement} svgElement - The SVG element to improve
 */
function improveSvgAccessibility(svgElement) {
  if (!svgElement) return;

  // Add title or aria-label if missing
  if (!svgElement.querySelector('title') && !svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    const title = document.createElement('title');
    title.textContent = 'Graphic'; // Default accessible name
    svgElement.insertBefore(title, svgElement.firstChild);
    
    // Link title to SVG with aria-labelledby
    const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
    title.id = titleId;
    svgElement.setAttribute('aria-labelledby', titleId);
  }
}

/**
 * Ensures landmarks are unique
 * Fixes REACT_025: React Unique Landmarks
 */
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      // Keep the first one, mark duplicates with aria-label
      for (let i = 1; i < elements.length; i++) {
        const existingLabel = elements[i].getAttribute('aria-label');
        if (!existingLabel) {
          const labels = ['Primary', 'Secondary', 'Tertiary', 'Additional'];
          elements[i].setAttribute('aria-label', labels[i - 1] || `Section ${i + 1}`);
        }
      }
    }
  });
}

/**
 * Replaces fake links with proper anchor elements
 * Fixes REACT_036: React Fake Link