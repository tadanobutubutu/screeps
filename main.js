tsx
// Assuming the component has an error state and a success state
// and that the success state also contains content that would
// be considered a main part of the document, we might refactor as follows:

// components/Dashboard.tsx:306
// Before:
// <main>
//   <!-- Error state content here -->
// </main>
// <main>
//   <!-- Success state content here -->
// </main>

// After:
// <main>
//   <!-- Error state content here -->
//   <!-- Other non-landmarked content here -->
// </main>
// <section>
//   <!-- Success state content here -->
//   <!-- This is now wrapped in a section tag instead of a second main tag -->
// </section>