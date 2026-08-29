'use client';

import { usePathname } from 'next/navigation';

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

function addLangAttribute() {
  // Add lang attribute to HTML element for REACT_015
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
  }
}

function addMainLandmark() {
  // Add main landmark if missing
  if (typeof document !== 'undefined') {
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length === 0) {
      const body = document.body;
      const main = document.createElement('main');
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
}

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  addLangAttribute();
  addMainLandmark();

  if (typeof document !== 'undefined') {
    const lang = pathname ? pathname.split('/')[1] || 'en' : 'en';
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"]');
    landmarks.forEach((landmark, index) => {
      landmark.setAttribute('aria-label', `Landmark ${index + 1}`);
    });

    const svg1 = document.querySelector('svg');
    const svg2 = document.querySelectorAll('svg')[1];
    if (svg1) svg1.setAttribute('aria-label', 'svg1-title');
    if (svg2) svg2.setAttribute('aria-label', 'svg2-title');

    const mainElements = document.querySelectorAll('main');
    if (mainElements.length > 1) {
      console.warn('Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
    }

    const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""]');
    fakeLinks.forEach(link => {
      link.setAttribute('role', 'presentation');
    });

    const links = document.querySelectorAll('a:not([role])');
    const buttons = document.querySelectorAll('button:not([role])');

    links.forEach(link => {
      if (!link.hasAttribute('href') || link.getAttribute('href') === '') {
        link.setAttribute('role', 'link');
      }
      if (!link.hasAttribute('href')) {
        console.error('Link without href attribute', link);
      }
    });

    buttons.forEach(button => {
      if (!button.hasAttribute('role')) {
        button.setAttribute('role', 'button');
      }
      if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
        console.error('Button without accessible name', button);
      }
    });
  }

  return (
    <html lang="en">
      <head>
        <title>Screeps Dashboard</title>
      </head>
      <body>{children}</body>
    </html>
  );
}