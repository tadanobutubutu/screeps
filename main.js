// main.js
import React from 'react';
import Head from 'next/head';

// Preserve all existing exports and functions
export const existingFunction = () => {
  // ... existing implementation
};

// Add new accessibility-focused functions
export const setLanguageAttribute = (lang = 'en') => {
  // REACT_015: React Language Attribute
  // Ensure the html element has a lang attribute
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

export const ensureTableAccessibility = (tableId) => {
  // REACT_027: React Table Structure
  // Add proper table structure with caption and scope attributes
  if (typeof document !== 'undefined') {
    const table = document.getElementById(tableId);
    if (table) {
      // Add caption if missing
      if (!table.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.textContent = 'Table data';
        table.insertBefore(caption, table.firstChild);
      }

      // Add scope attributes to th elements
      const headers = table.querySelectorAll('th');
      headers.forEach(th => {
        if (!th.hasAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      });
    }
  }
};

export const addLandmarks = () => {
  // REACT_017: React Landmarks
  // Add proper ARIA landmarks
  if (typeof document !== 'undefined') {
    // Add main landmark if missing
    if (!document.querySelector('main[role="main"]')) {
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('role', 'main');
      }
    }

    // Add navigation landmark if missing
    if (!document.querySelector('nav[role="navigation"]')) {
      const nav = document.querySelector('nav');
      if (nav) {
        nav.setAttribute('role', 'navigation');
      }
    }
  }
};

export const ensureSvgAccessibility = (svgId) => {
  // REACT_041: React SVG Accessible Name
  // Add title/desc to SVG elements
  if (typeof document !== 'undefined') {
    const svg = document.getElementById(svgId);
    if (svg && !svg.querySelector('title, desc')) {
      const title = document.createElement('title');
      title.textContent = 'SVG graphic';
      svg.insertBefore(title, svg.firstChild);
    }
  }
};

export const ensureUniqueLandmarks = () => {
  // REACT_025: React Unique Landmarks
  // Ensure landmarks are unique
  if (typeof document !== 'undefined') {
    const landmarks = {
      'main': 0,
      'navigation': 0,
      'search': 0,
      'banner': 0,
      'complementary': 0,
      'contentinfo': 0
    };

    Object.keys(landmarks).forEach(role => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      if (elements.length > 1) {
        console.warn(`Multiple elements with role="${role}" found. Only the first will be kept.`);
        for (let i = 1; i < elements.length; i++) {
          elements[i].removeAttribute('role');
        }
      }
    });
  }
};

export const replaceFakeLinks = (linkSelector) => {
  // REACT_036: React Fake Link
  // Replace fake links with proper anchor elements
  if (typeof document !== 'undefined') {
    const fakeLinks = document.querySelectorAll(linkSelector);
    fakeLinks.forEach(link => {
      if (!link.tagName.toLowerCase() === 'a') {
        const anchor = document.createElement('a');
        anchor.href = link.getAttribute('data-href') || '#';
        anchor.textContent = link.textContent;
        link.parentNode.replaceChild(anchor, link);
      }
    });
  }
};

// Initialize accessibility features on client-side
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    setLanguageAttribute();
    addLandmarks();
    ensureUniqueLandmarks();
  });
}

// Preserve any existing component exports
export default function Home() {
  return (
    <div>
      <Head>
        <title>Accessible Application</title>
        <meta name="description" content="An accessible Next.js application" />
      </Head>
      {/* ... existing content */}
    </div>
  );
}