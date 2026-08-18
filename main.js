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
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}