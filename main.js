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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Dashboard Icon</title>
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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Screeps Dashboard Icon</title>
        </svg>
        {children}
      </body>
    </html>
  )
}