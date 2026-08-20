// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

// app/page.tsx
'use client';

export default function Page() {
  const handleRotateBack = () => {
    // Logic to rotate back
    console.log('Rotate back clicked');
  };

  return (
    <div>
      {/* Existing page content */}
      <h1>Image Viewer</h1>
      
      {/* Fixed: Changed from <a id="unrotate" href="#"> to <button> */}
      <button
        id="unrotate"
        onClick={handleRotateBack}
        type="button"
        aria-label="Rotate image back to original position"
      >
        rotate back
      </button>
    </div>
  );
}