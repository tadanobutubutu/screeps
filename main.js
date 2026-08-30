// TODO: Address any missing required exports
// REACT_015: Add lang attribute
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Existing Code
// --------------

export const getLang = () => {
  let lang = 'en';
  if (typeof navigator !== 'undefined') {
    if (navigator.language) {
      lang = navigator.language;
    } else if (navigator.userLanguage) {
      lang = navigator.userLanguage;
    }
  }
  // Return only the language code (e.g., 'en', 'es', 'fr')
  return lang.split('-')[0].split('_')[0];
};

export const setLang = (lang) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

export const supportedLangs = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

export const isValidLang = (lang) => {
  return supportedLangs.includes(lang);
};

export const getDefaultLang = () => {
  return 'en';
};