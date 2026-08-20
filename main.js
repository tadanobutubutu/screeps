// Incorrect usage (JSX in a JavaScript file)
// <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
// <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
//   // ... JSX content ...

// Corrected usage (JSX should be in a .tsx or .jsx file)
// const section = (
//   <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
//     {/* ... JSX content ... */}
//   </section>
// );

// const main = (
//   <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
//     {/* ... JSX content ... */}
//   </main>
// );

// Export the components if they are meant to be used in other parts of the application
// export { section, main };