// Example of how to replace an anchor tag with a button for a link
// Assuming the following HTML is part of your `docs/dependency-graph.html`:
// <a id="unrotate" href="#">rotate back</a>

// This is how you would update the JavaScript that controls the behavior of this link:

// Before (potentially part of main.js or another script file):
// document.getElementById('unrotate').addEventListener('click', function() {
//   // Logic to rotate back
// });

// After updating the HTML to use a button:
// Replace the <a> tag with a <button> in your HTML:
// <button id="unrotate">rotate back</button>

// Then, update the JavaScript to handle the button click:
// document.getElementById('unrotate').addEventListener('click', function() {
//   // Logic to rotate back
// });

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