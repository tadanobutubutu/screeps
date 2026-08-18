tsx
import React, { ReactNode } from 'react'

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <body>
      <main>{children}</main>
    </body>
  )
}

export default Layout