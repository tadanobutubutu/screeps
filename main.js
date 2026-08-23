// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element

export const metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
  htmlLang: 'en',
  icons: {
    icon: {
      url: 'data:image/svg+xml',
      href: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard Icon</title><circle cx="50" cy="50" r="40" fill="%23ff6644"/></svg>',
    },
    apple: {
      url: 'data:image/svg+xml',
      href: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard Apple Icon</title><circle cx="50" cy="50" r="40" fill="%2300ff88"/></svg>',
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

// TODO: Add back any required exports that might have been removed
// (placeholder comment retained for future reference)