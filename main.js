// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps game dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Logo</title>
        </svg>
        {children}
      </body>
    </html>
  )
}

// dashboard/app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps game dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Logo</title>
        </svg>
        {children}
      </body>
    </html>
  )
}