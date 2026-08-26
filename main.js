tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Dashboard for Screeps game',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}