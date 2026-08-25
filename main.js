export function setDocumentLanguage(lang = 'en') {
  document.documentElement.lang = lang;
}

function rotateBack() {
  // ... existing logic ...
  document.getElementById('rotateBackButton').click();
}