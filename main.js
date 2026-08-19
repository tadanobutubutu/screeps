// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        {/* Updated th elements with scope attribute */}
        <table>
          <thead>
            <tr>
              <th scope="col"><div>src/constants.js</div></th>
              <th scope="col"><div>src/managers/roomManager.js</div></th>
              <th scope="col"><div>src/managers/spawnManager.js</div></th>
              <th scope="col"><div>src/managers/towerManager.js</div></th>
              <th scope="col"><div>src/roles/builder.js</div></th>
              {/* ... rest of the headers with scope="col" ... */}
            </tr>
          </thead>
          <tbody>
            {/* ... table rows ... */}
          </tbody>
        </table>
      </body>
    </html>
  );
}