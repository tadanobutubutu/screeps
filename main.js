// Fixed for REACT_017: Added <main> landmark for accessibility
// This is the fixed app/layout.tsx (main layout) converted to JavaScript/JSX

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}