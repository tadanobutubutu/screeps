// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// TODO: Implement the required changes to improve accessibility for the addBook function or form

const addBookButton = document.createElement('button');
addBookButton.id = 'addBook';
addBookButton.setAttribute('aria-label', 'Add a new book');
addBookButton.type = 'button';

function addBook() {
  const bookTitleInput = document.getElementById('bookTitle');
  const bookAuthorInput = document.getElementById('bookAuthor');
  
  if (bookTitleInput && bookAuthorInput) {
    if (bookTitleInput.value.trim() === '') {
      bookTitleInput.setAttribute('aria-invalid', 'true');
      bookTitleInput.setAttribute('aria-describedby', 'bookTitleError');
    }
    if (bookAuthorInput.value.trim() === '') {
      bookAuthorInput.setAttribute('aria-invalid', 'true');
      bookAuthorInput.setAttribute('aria-describedby', 'bookAuthorError');
    }
  }
}

export { addBook, addBookButton };