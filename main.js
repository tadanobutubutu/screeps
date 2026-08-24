const originalMain = document.createElement('html');
// Clone the existing 'html' element and update it with the language attribute
const fixedHtml = originalMain.cloneNode(true);
fixedHtml.lang = 'en';

// Continue with the rest of your code

export default fixedHtml.outerHTML;