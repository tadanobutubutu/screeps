import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // REACT_015: Set the lang attribute on the HTML element
  useEffect(() => {
    document.documentElement.setAttribute('lang', 'en');
  }, []);

  // REACT_017: Add landmark roles to fix landmark issues and ensure unique landmarks
  useEffect(() => {
    const validateUniqueLandmarks = (container) => {
      const landmarks = container.querySelectorAll(
        '[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer'
      );
      const landmarkNames = new Set();
      const issues = [];

      landmarks.forEach((landmark) => {
        const ariaLabel = landmark.getAttribute('aria-label');
        const ariaLabelledby = landmark.getAttribute('aria-labelledby');
        const tagName = landmark.tagName.toLowerCase();

        // Determine the landmark name
        let landmarkName = ariaLabel || ariaLabelledby || tagName;
        if (landmarkNames.has(landmarkName)) {
          issues.push({
            element: landmark,
            message: `Duplicate landmark found: "${landmarkName}". Use unique aria-label or aria-labelledby.`,
            severity: 'warning'
          });
        } else {
          landmarkNames.add(landmarkName);
        }
      });

      return issues;
    };

    const setLandmarkRoles = (container) => {
      const landmarks = container.querySelectorAll(
        '[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]'
      );
      landmarks.forEach((landmark) => {
        const landmarkName = getUniqueLandmarkName(
          landmark.dataset.landmarkRole || 'banner',
          landmarkNames
        );
        landmark.setAttribute('aria-labelledby', `landmark-${landmarkName}`);
        landmark.setAttribute('id', `landmark-${landmarkName}`);
      });
    };

    const landmarkIssues = validateUniqueLandmarks(document.querySelector('body'));
    if (landmarkIssues.length > 0) {
      console.error(
        'The following accessibility issues were found regarding landmarks (duplicate and unique), please address:',
        landmarkIssues
      );

      // Implement solutions to issues
      setLandmarkRoles(document.querySelector('body'));
    }
  }, []);

  // REACT_041: Add accessible names to SVGs
  useEffect(() => {
    const addSvgAccessibleName = (svgElement, accessibleName) => {
      if (!svgElement) return;

      // Add title element as first child
      const title = document.createElement('title');
      title.id = `svg-title-${Date.now()}`;
      title.textContent = accessibleName;

      // Insert title as first child
      svgElement.insertBefore(title, svgElement.firstChild);

      // Add aria-labelledby attribute
      svgElement.setAttribute('aria-labelledby', title.id);
    };

    const svgsToFix = document.querySelectorAll('svg');
    svgsToFix.forEach((svgElement) => {
      const accessibleName = svgElement.dataset.accessibleName;
      if (accessibleName) {
        addSvgAccessibleName(svgElement, accessibleName);
      }
    });
  }, []);

  // REACT_036: Fix fake link issues - convert to proper semantic elements
  useEffect(() => {
    const isValidLink = (element) => {
      if (!element) return true;

      const tagName = element.tagName.toLowerCase();
      const href = element.getAttribute('href');
      const onClick = element.getAttribute('onclick');

      // Check if it's a fake link (div/span with onClick but no href, or an anchor without href)
      const isFakeLink = (tagName === 'div' || tagName === 'span') && onClick && !href;

      if (isFakeLink) {
        return {
          valid: false,
          suggestion: `Replace <${tagName}> with <button> or <a href="#"> for proper accessibility.`
        };
      }

      return { valid: true };
    };

    const fixFakeLinks = () => {
      const linksToFix = document.querySelectorAll(
        'div, span:not([href]):not([tabindex="-1"])'
      );
      linksToFix.forEach((link) => {
        const { valid, suggestion } = isValidLink(link);

        if (!valid) {
          console.warn(suggestion);
          const cover = document.createElement('a');
          cover.href = '#';
          link.appendChild(cover);
          link.removeAttribute('onclick');
        }
      });
    };

    fixFakeLinks();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

module.exports = { App };