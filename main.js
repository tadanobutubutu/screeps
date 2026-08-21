// Common Accessibility Fixes for React Components:

// 1. REACT_015 - Add lang attribute (typically in _app.js or layout component)
// <html lang="en">

// 2. REACT_017 - Use semantic landmarks
// <header>, <nav>, <main>, <footer>, <aside>

// 3. REACT_025 - Ensure unique landmark regions
// Don't have multiple <main> elements, use unique IDs for navigation
// FIX: Keep a single <main> element and use <section> or <article> for other regions
// The issue occurs when using ternary/render functions that return separate <main> elements
// Example Bad Pattern:
//   {isError ? (
//     return <main>Error content</main>
//   ) : (
//     return <main>Success content</main>
//   )}
//
// Example Good Pattern - Use a single <main> with conditional inner sections:
//   return (
//     <main>
//       {isError ? (
//         <section aria-labelledby="error-heading">
//           <h1 id="error-heading">Error</h1>
//           <ErrorContent />
//         </section>
//       ) : (
//         <section aria-labelledby="success-heading">
//           <h1 id="success-heading">Success</h1>
//           <SuccessContent />
//         </section>
//       )}
//     </main>
//   );
//
// Example Good Pattern - Using early return at top level (if applicable):
//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <ErrorFallback />;
//   return (
//     <main>
//       <Content />
//     </main>
//   );
//
// Another Good Pattern - Conditional wrapper (only wraps when needed):
//   const mainContent = isError ? (
//     <ErrorContent />
//   ) : (
//     <SuccessContent />
//   );
//   
//   return isPageLevelMain ? <main>{mainContent}</main> : <div>{mainContent}</div>;

// 4. REACT_027 - Proper table structure
/*
<table>
  <thead>
    <tr>
      <th scope="col">Header 1</th>
      <th scope="col">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
*/

// 5. REACT_036 - Use <button> instead of <a> for non-navigation elements
// <button ... instead of <a href="#" ...

// 6. REACT_041 - Add accessible names to SVGs
// <svg aria-label="Close menu" role="img">
//   <title>Menu Icon</title>
//   <path d="..." />
// </svg>
// OR use aria-hidden="true" if purely decorative

module.exports = { accessibilityFixes: true };