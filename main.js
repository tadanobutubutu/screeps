import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Screeps',
  description: 'Screeps is an open-source multiplayer creep strategy game.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header role="banner">
          <h1>Screeps</h1>
        </header>
        <main role="main">
          {children}
        </main>
        <footer role="contentinfo">
          <p>Screeps is an open-source multiplayer creep strategy game.</p>
        </footer>
      </body>
    </html>
  )
}