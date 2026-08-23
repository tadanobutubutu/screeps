// Example fix pattern for the duplicate <main> issue:
// Change one of the <main> elements to a different landmark like <section> or <article>

// BEFORE:
// return (
//   <main>...</main>
// );

// AFTER:
// return (
//   <section>...</section>  // or <article>
// );