// main.js - Fixes for accessibility issues (REACT_015, REACT_025, REACT_027, REACT_036, REACT_041)

import React from 'react';

export function getSettingsForm(formElement) {
  return {
    // Fix REACT_015: Add lang attribute check
    checkLangAttribute: () => {
      const lang = formElement.lang || formElement.getAttribute('lang');
      return lang ? { pass: true, lang } : { pass: false, error: 'Missing lang attribute' };
    },
    
    // Fix REACT_025: Ensure unique landmarks
    checkLandmarks: () => {
      const landmarks = formElement.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
      const landmarkTypes = {};
      landmarks.forEach(lm => {
        const role = lm.getAttribute('role');
        if (landmarkTypes[role]) {
          landmarkTypes[role].push(lm);
        } else {
          landmarkTypes[role] = [lm];
        }
      });
      
      const duplicates = Object.entries(landmarkTypes)
        .filter(([_, els]) => els.length > 1)
        .map(([role]) => role);
      
      return duplicates.length === 0 
        ? { pass: true }
        : { pass: false, duplicates, error: `Duplicate landmarks: ${duplicates.join(', ')}` };
    },
    
    // Fix REACT_027: Check table structure
    checkTableStructure: () => {
      const tables = formElement.querySelectorAll('table');
      const issues = [];
      
      tables.forEach((table, i) => {
        const hasCaption = table.querySelector('caption');
        const headers = table.querySelectorAll('th');
        const hasHeaderScope = Array.from(headers).every(th => th.getAttribute('scope'));
        
        if (!hasCaption) issues.push(`Table ${i}: Missing caption`);
        if (!hasHeaderScope) issues.push(`Table ${i}: Headers missing scope attribute`);
      });
      
      return issues.length === 0
        ? { pass: true }
        : { pass: false, issues };
    },
    
    // Fix REACT_036: Check for fake links (buttons styled as links or links styled as buttons)
    checkFakeLinks: () => {
      const links = formElement.querySelectorAll('a');
      const fakeLinks = [];
      
      links.forEach(link => {
        const style = window.getComputedStyle(link);
        const isButtonStyled = style.cursor === 'pointer' && !link.href;
        if (isButtonStyled) {
          fakeLinks.push(link);
        }
      });
      
      return fakeLinks.length === 0
        ? { pass: true }
        : { pass: false, count: fakeLinks.length, error: 'Links without href detected' };
    },
    
    // Fix REACT_041: Check SVG accessibility
    checkSvgAccessibility: () => {
      const svgs = formElement.querySelectorAll('svg');
      const issues = [];
      
      svgs.forEach((svg, i) => {
        const hasAriaLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');
        const hasTitle = svg.querySelector('title');
        const role = svg.getAttribute('role');
        
        if (!hasAriaLabel && !hasTitle) {
          issues.push(`SVG ${i}: Missing accessible name (aria-label, aria-labelledby, or <title>)`);
        }
        
        if (!role) {
          issues.push(`SVG ${i}: Missing role attribute`);
        }
      });
      
      return issues.length === 0
        ? { pass: true }
        : { pass: false, issues };
    }
  };
}

// Example component with accessibility fixes applied
export function SettingsForm({ languages, onSave }) {
  // Fix REACT_015: Add lang attribute
  return (
    <form 
      lang="en"
      onSubmit={handleSubmit}
      role="form"
      aria-labelledby="form-title"
    >
      {/* Fix REACT_025: Use semantic landmarks, don't duplicate */}
      <main role="main">
        <h1 id="form-title">Repository Language Settings</h1>
        
        {/* Fix REACT_027: Proper table structure with caption and scope */}
        <table>
          <caption>Programming languages and frameworks</caption>
          <thead>
            <tr>
              <th scope="col">Language</th>
              <th scope="col">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {languages.map(lang => (
              <tr key={lang.name}>
                <th scope="row">{lang.name}</th>
                <td>{lang.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Fix REACT_036: Use proper <button> instead of <a> without href */}
        <button type="submit" aria-describedby="save-hint">
          Save Settings
        </button>
        <span id="save-hint" className="sr-only">Saves your language preferences</span>
        
        {/* Fix REACT_041: Add accessible name to SVG */}
        <svg 
          role="img" 
          aria-label="Settings icon" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
        >
          <title>Settings gear icon</title>
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
        </svg>
      </main>
    </form>
  );
}

// Ensure no duplicate main landmarks in the app
export function AppShell({ children }) {
  return (
    <div lang="en">
      {/* Only ONE <main> landmark per page */}
      {children}
    </div>
  );
}