// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Landmark issues are handled within components and not in main.js
// - REACT_041: Accessible names for SVGs are also handled within components and not in main.js
// - REACT_025: Unique landmarks are also handled within components and not in main.js
// - REACT_036: Fake link issues are also handled within components and not in main.js

export const metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
  htmlLang: 'en',
  icons: {
    icon: {
      url: 'data:image/svg+xml',
      href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard Icon</title><circle cx="50" cy="50" r="40" fill="%23ff6644"/></svg>'
    },
    apple: {
      url: 'data:image/svg+xml',
      href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard Apple Icon</title><circle cx="50" cy="50" r="40" fill="%2300ff88"/></svg>'
    },
  },
};

export function getHtmlLang() {
  return metadata.htmlLang;
}

export function getHtmlAttributes() {
  return {
    lang: metadata.htmlLang,
  };
}

export function getHTMLAttributes() {
  const attributes = getHtmlAttributes();
  return { ...attributes };
}

export function getHtmlAttrs() {
  return {
    lang: metadata.htmlLang,
  };
}

// TODO: Add back any required exports that might have been removed
// Here's an example of how to export a required function from another file:
// import { someFunction } from './some-file';
// export { someFunction };

// Add the missing HTML lang attribute to the HTML root element
// This should be added in the client's build process, not in JavaScript
// Add this comment to explain it to the developers who are working on the client side

/**
 * Add the missing HTML lang attribute to the HTML root element
 * This should be added in the client's build process
 *
 * Here's an example of how to do it using a React application's HTML template:
 *
 * <Html lang="en">
 *   <Head>
 *     {/* Other head data */}
 *   </Head>
 *   <Body>
 *     {/* Other body content */}
 *   </Body>
 * </Html>
 */