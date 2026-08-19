tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: '...<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>App Icon</title><text y=".9em" ...',
        type: 'image/svg+xml',
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
      </body>
    </html>
  )
}