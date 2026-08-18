import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps game dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

// Add new React 19 compatibility functions if needed
// For example, if using new React 19 features:
export function useOptimisticState(initialState) {
  const [state, setState] = React.useState(initialState);

  const updateState = (newState) => {
    setState(newState);
    // Additional optimistic state handling can be added here
  };

  return [state, updateState];
}

// Add Jest 30 compatibility functions if needed
// For example, if using new Jest 30 features:
export function createTestContext() {
  return {
    // Add any test context setup needed for Jest 30 compatibility
    // This is just a placeholder - actual implementation would depend on your test needs
    mockFunction: jest.fn(),
    testUtils: {
      // Add test utilities here
    }
  };
}