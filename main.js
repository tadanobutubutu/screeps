import React from 'react';
import { App } from './App';
import faviconSvg from './dashboard/app/layout.tsx';
import innerFaviconSvg from './app/layout.tsx';

faviconSvg = faviconSvg.replace(`aria-hidden="true"`, '').replace(/<svg/, `<svg aria-hidden="true"`);
innerFaviconSvg = innerFaviconSvg.replace(/data:image\/svg+xml,<svg/, `data:image/svg+xml,<svg aria-hidden="true"`);

const icons = {
  icon: `data:image/svg+xml,${faviconSvg}`
};

function RotateBack() {
  const handleRotateBack = () => {
    console.log('Rotating back...');
  };

  return (
    <a id="unrotate" href="#" onClick={handleRotateBack}>
      rotate back
    </a>
  );
}

function createHTMLMarkup() {
  const faviconMarkup = `<link rel="icon" href="${faviconSvg}" />`;
  // ... (existing code removed for brevity)

  return `
    <html>
      ${htmlMarkup}
      ${faviconMarkup}
    </html>
  `;
}

ReactDOM.render(
  <App innerHTML={createHTMLMarkup()} icons={icons}>
    <RotateBack />
  </App>
);

export default RotateBack;