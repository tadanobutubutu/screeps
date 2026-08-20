// Modified to include the Screeps API script in the head for Screeps bot compatibility.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.screeps.com/api.js"></script>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

// New function to handle the rotation back action
function handleRotateBack() {
  // Add your rotation logic here
  console.log('Rotating back');
}