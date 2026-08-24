tsx
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Visualize your Screeps AI',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" font-size="90" xmlns="http://www.w3.org/2000/svg">🖥️</text></svg>',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><text y=".9em" font-size="90" xmlns="http://www.w3.org/2000/svg">🖥️</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
}