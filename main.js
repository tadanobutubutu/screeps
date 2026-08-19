tsx
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps',
  description: 'Screeps is a MMO sandbox game for programmers',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        // Added aria-label for accessibility
        'aria-label': 'Screeps favicon'
      }
    ]
  }
}

// dashboard/app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Dashboard for Screeps game',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        // Added aria-label for accessibility
        'aria-label': 'Screeps dashboard favicon'
      }
    ]
  }
}