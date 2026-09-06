// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]
import { dependencyGraphContent, indexContent } from './content';

// ===== EXISTING FUNCTIONS PRESERVED FROM ORIGINAL main.js =====

export function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

export function getFullLangAttribute() {
  const lang = document.documentElement.lang;
  return lang ? `${lang}-${lang.toUpperCase()}` : 'en-US';
}

export function validateTableAccessibility(table) {
  if (!table) return { valid: false, errors: ['Table not found'] };
  const errors = [];
  if (!table.querySelector('th')) {
    errors.push('Table is missing header cells');
  }
  if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
    errors.push('Table is missing a caption or aria-label');
  }
  return { valid: errors.length === 0, errors };
}

export function validateTableStructure(table) {
  if (!table) return { valid: false, issues: ['Table not found'] };
  const issues = [];
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) issues.push('Table has no rows');
  rows.forEach((row, index) => {
    if (row.children.length === 0) {
      issues.push(`Row ${index} has no cells`);
    }
  });
  return { valid: issues.length === 0, issues };
}

export function validateLandmark(landmark) {
  if (!landmark) return { valid: false, error: 'Landmark not found' };
  if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
    return { valid: false, error: 'Landmark missing accessible name' };
  }
  return { valid: true };
}

export function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  const results = Array.from(landmarks).map(landmark => validateLandmark(landmark));
  return {
    total: landmarks.length,
    valid: results.filter(r => r.valid).length,
    results
  };
}

export function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

export function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

export function createAccessibleLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  return link;
}