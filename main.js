// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps',
  description: 'Screeps is a programming game for programmers',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        href: '/favicon.ico',
        rel: 'icon',
        type: 'image/x-icon',
      },
      {
        url: '/favicon.svg',
        href: '/favicon.svg',
        rel: 'icon',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Decorative element</title>
        </svg>
      </body>
    </html>
  )
}

// dashboard/app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        href: '/favicon.ico',
        rel: 'icon',
        type: 'image/x-icon',
      },
      {
        url: '/favicon.svg',
        href: '/favicon.svg',
        rel: 'icon',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <title>Decorative element</title>
        </svg>
      </body>
    </html>
  )
}