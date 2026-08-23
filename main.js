x
import React from 'react';

const Document = ({ children }) => {
  return (
    <html>
      <head>
        {children.head}
      </head>
      <body>
        <main>{children.body}</main>
        {children.footer}
      </body>
    </html>
  );
};

export default Document;