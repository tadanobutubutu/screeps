// Before
// <svg>...</svg>

// After
// <svg aria-hidden="true">...</svg>

// Example with specific content:
// <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
// </svg>

// Example of adding aria-hidden to an existing SVG:
// <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//   <title>Icon description</title>
//   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0 1c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-13h-2v6h2zm0 8h-2v2h2z"/>
// </svg>
// <svg aria-hidden="true">...</svg>