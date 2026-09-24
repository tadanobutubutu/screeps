import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import { getRootHtmlAccessibilityProps, getLandmarkProps, getSvgAccessibilityProps, getAccessibleLinkProps } from './accessibility';

// Add lang attribute to HTML element
const addLangAttribute = () => {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
};

// Fix table structure issues
const fixTableStructureIssues = () => {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure proper table structure
    if (!table.querySelector('thead') || !table.querySelector('tbody')) {
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');

      if (rows.length > 0) {
        thead.appendChild(rows[0]);
        rows.forEach((row, index) => {
          if (index > 0) tbody.appendChild(row);
        });
        table.insertBefore(thead, table.firstChild);
        table.appendChild(tbody);
      }
    }

    // Add scope attributes to headers
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  });
};

// Add/fix landmark issues
const addMainLandmark = () => {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    const content = document.querySelector('body > div');
    if (content) {
      content.parentNode.insertBefore(main, content);
      main.appendChild(content);
    }
  }
};

// Add accessible names to SVGs
const addSvgAccessibleNames = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `Graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
  });
};

// Ensure unique landmarks
const ensureUniqueLandmarks = () => {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    Array.from(mainElements).slice(1).forEach(main => {
      main.removeAttribute('role');
    });
  }
};

// Fix fake link issue
const fixFakeLinkIssue = () => {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
};

// Initialize accessibility fixes
const initializeAccessibility = () => {
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
};

// Call accessibility initialization when component mounts
const useAccessibility = () => {
  useEffect(() => {
    initializeAccessibility();
  }, []);
};

// ... The rest of the file remains the same as the 'origin/main' section.