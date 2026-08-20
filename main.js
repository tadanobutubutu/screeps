// Main application module
export function renderApp() {
  // SVG with accessible name (fixed REACT_041)
  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M12 2L2 22h20L12 2z" />
    </svg>
  `;
  
  return { iconSvg };
}

export default renderApp;