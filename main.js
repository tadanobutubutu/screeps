// app/layout.tsx
// Fix: Wrap children in <main> landmark for accessibility

/** @type ... */
const nextConfig = {
  reactStrictMode: true,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}