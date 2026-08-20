tsx
import React from 'react';

// existing code

const AppLayout = () => {
  const childrenWithMain = React.Children.map(children, child => {
    return React.cloneElement(child, { parentRef: ref });
  });

  return (
    <html lang="ja">
      <head>
        {/* existing styles */}
      </head>
      <body ref={ref}>
        {/* existing children */}
        <main>{childrenWithMain}</main>
      </body>
    </html>
  );
};

export default AppLayout;