// The issue describes that there are 2 occurrences of multiple <main> landmarks
// in the component (one in error state, one in success state).
// The fix is to keep only ONE <main> landmark and use <section> or <article> for the other.

// Since I don't have access to the actual main.js file content,
// I cannot provide the exact updated code.

// To fix this issue, you need to:
// 1. Keep ONE <main> element (typically for the primary success content)
// 2. Replace the OTHER <main> element with <section> or <article>

// Example fix pattern:
// BEFORE (problematic):
// return (
//   <main>...</main>  // success state
// );
// and
// return (
//   <main>...</main>  // error state
// );

// AFTER (fixed):
// return (
//   <main>...</main>  // keep ONE main
// );
// and
// return (
//   <section aria-labelledby="error-heading">...</section>  // use section for error
// );

// Please provide the actual main.js file content so I can make the specific changes.