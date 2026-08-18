// app/layout.tsx
// Fix: Wrap children in <main> landmark for accessibility

/** @type {import('next').NextConfig} */
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