// Updated main.js with <main> landmark for REACT_017 compliance
export default function Layout({ children }) {
  return (
    <html>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}