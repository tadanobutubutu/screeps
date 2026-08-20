// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps',
  description: 'Screeps is a programming game for the masses.',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        href: '/favicon.ico',
        rel: 'icon',
        type: 'image/x-icon',
        sizes: 'any',
      },
      {
        url: '/icon.svg',
        href: '/icon.svg',
        rel: 'icon',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        href: '/apple-touch-icon.png',
        rel: 'apple-touch-icon',
        sizes: '180x180',
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