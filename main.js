tsx
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps',
  description: 'Screeps game',
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
      <body>{children}</body>
    </html>
  )
}