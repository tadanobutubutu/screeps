// BEFORE (problematic - two <main> elements):
// {isError ? (
//   <main>Error content</main>
// ) : (
//   <main>Success content</main>
// )}
//
// AFTER (fixed - only one <main>):
// <main>
//   {isError ? (
//     <section>Error content</section>
//   ) : (
//     <section>Success content</section>
//   )}
// </main>