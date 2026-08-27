// Original code
// <main>
//   ... content ...
// </main>
// <main>
//   ... other content ...
// </main>

// Modified code with conditional rendering and proper landmarks
// <main>
//   { /* Conditionally render the main content */ }
//   { isError ? (
//     <section>
//       <p>Error message goes here</p>
//     </section>
//   ) : isSuccessful ? (
//     <section>
//       <p>Success message goes here</p>
//     </section>
//   ) : (
//     <article>
//       <p>Default content goes here</p>
//     </article>
//   )}
// </main>