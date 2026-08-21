tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'App Title',
  description: 'App description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          aria-hidden="true" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* SVG content */}
        </svg>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}