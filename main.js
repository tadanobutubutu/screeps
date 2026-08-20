typescript
// app/layout.tsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import en from '@jsx-a11y/i18n/dist/lang/en';
import { configure, createProvider } from '@jsx-a11y/backend';
import { useRef } from 'react';
import { render } from '@testing-library/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const documentRef = useRef(document);

  useEffect(() => {
    // Initialize the a11y checking backend and the provider
    const backend = configure({ i18n: { lng: en, resources: en });
    const provider = createProvider({ backend });

    // Wrap the children with the react-jsx-a11y Provider to enable a11y checking
    const jsxElement = (
      <provider.Provider>
        {children}
      </provider.Provider>
    );

    // Render the JSX element into the document body
    ReactDOM.render(jsxElement, documentRef.current.body);

    // Clean up on component unmount
    return () => {
      ReactDOM.unmountComponentAtNode(documentRef.current.body);
    };
  }, [children]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Screeps</title>
        <svg aria-hidden="true" style={{ display: 'none' }}>
          {/* Your SVG content here */}
        </svg>
      </head>
      <body>{documentRef.current.body}</body>
    </html>
  );
}