// Common Accessibility Fixes for React Components:

// 1. REACT_015 - Add lang attribute (typically in _app.js or layout component)
// <html lang="en">

// Next.js _document.js implementation:
/*
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
*/

// 2. REACT_017 - Use semantic landmarks
// <header>, <nav>, <main>, <footer>, <aside>

// 3. REACT_025 - Ensure unique landmark regions
// Don't have multiple <main> elements, use unique IDs for navigation
// FIX: Keep a single <main> element and use <section> or <article> for other regions
// Example:
// Instead of:
//   {isError ? <main>Error content</main> : <main>Success content</main>}
// Use:
//   <main>
//     {isError ? <section>Error content</section> : <section>Success content</section>}
//   </main>

// 4. REACT_027 - Proper table structure
/*
<table>
  <thead>
    <tr>
      <th scope="col">Header 1</th>
      <th scope="col">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
*/

// 5. REACT_036 - Use <button> instead of <a> for non-navigation elements
// <button ... instead of <a href="#" ...

// 6. REACT_041 - Add accessible names to SVGs
// <svg aria-label="Close menu" role="img">
//   <title>Menu Icon</title>
//   <path d="..." />
// </svg>
// OR use aria-hidden="true" if purely decorative

// REACT_015 - Function to validate/apply lang attribute to document
function applyLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
  return lang;
}

// Function to get current document language
function getDocumentLang() {
  if (typeof document !== 'undefined') {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

module.exports = { 
  accessibilityFixes: true,
  applyLangAttribute,
  getDocumentLang
};