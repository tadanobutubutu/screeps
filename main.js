// Current main.js content not provided.
// Please paste the contents of main.js (and any other affected files)
// so I can make the necessary changes to fix the REACT_025 issue.

// Based on the issue description, the fix involves:
// 1. Keeping only ONE <main> landmark in the component
// 2. Replacing the other <main> with <section> or <article> for semantic structure

// Example fix pattern (adjust based on your actual code):

// BEFORE (problematic - multiple <main> landmarks):
/*
function Component() {
  if (error) {
    return (
      <main>  // ❌ This should be <section> or <article>
        <h1>Error</h1>
        ...
      </main>
    );
  }
  return (
    <main>  // ✅ Keep this as <main>
      ...success content...
    </main>
  );
}
*/

// AFTER (fixed - only one <main> landmark):
/*
function Component() {
  if (error) {
    return (
      <section aria-labelledby="error-heading">  // ✅ Use <section> instead
        <h1 id="error-heading">エラー</h1>
        ...
      </section>
    );
  }
  return (
    <main>
      ...success content...
    </main>
  );
}
*/

// Please provide the actual file contents so I can apply the fix.