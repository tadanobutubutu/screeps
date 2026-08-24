typescript
import React, { ReactNode } from 'react';

const SuccessState = ({ children }: { children: ReactNode }) => (
  <main aria-label="Dashboard - Success state">
    {children}
  </main>
);

const ErrorState = ({ children }: { children: ReactNode }) => (
  <main aria-label="Dashboard - Error state">
    {children}
  </main>
);

// Now, use the SuccessState or ErrorState components as needed, keeping only one main landmark in your render method