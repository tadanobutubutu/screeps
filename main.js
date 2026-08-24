import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

// Resolve merge conflicts: keep accessible structure and add missing fixes
export class MyDocument extends Document {
  render() {
    // Fix REACT_015: React Language Attribute
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
}

// Fix REACT_027: React Table Structure
export function AccessibleTable() {
  return (
    <table role="table" aria-label="Data">
      <caption>Data Table</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Item</th>
          <td>Data</td>
        </tr>
      </tbody>
    </table>
  );
}

// Fix REACT_041: React SVG Accessible Name
export function AccessibleSVG() {
  return (
    <svg
      role="img"
      aria-label="Accessible icon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <title>Accessible icon</title>
      <rect x="4" y="4" width="16" height="16" fill="currentColor" />
    </svg>
  );
}

// Fix REACT_017 / REACT_025: React Landmarks and Unique Landmarks
export function LandmarkLayout() {
  return (
    <div>
      <header role="banner" aria-label="Site header">
        <nav role="navigation" aria-label="Primary navigation" />
      </header>
      <main id="main-content" role="main" aria-label="Main content">
        <section aria-label="Introduction" role="region">
          <h1>Welcome</h1>
        </section>
      </main>
    </div>
  );
}

// Fix REACT_036: React Fake Link
export function RealLink() {
  return <a href="/">Real Link</a>;
}

export default function MainPage() {
  return (
    <>
      <LandmarkLayout />
      <AccessibleTable />
      <AccessibleSVG />
      <RealLink />
    </>
  );
}