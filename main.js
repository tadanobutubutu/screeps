// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps',
  description: 'Screeps is an open-source multiplayer creep strategy game.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main role="main">
          {children}
        </main>
        {/* Modified the link to be a button for accessibility */}
        <button id="unrotate" onClick={() => {/* Implement the action for rotating back here */}} aria-label="Rotate back to original orientation">rotate back</button>
      </body>
    </html>
  )
}