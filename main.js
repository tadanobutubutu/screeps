tsx
import React from 'react';
import ui, { Container } from 'component/UI';

const Layout: React.FC<any> = ({ children }) => {
  return (
    <body>
      <ui.Header>
        <Container>
          <h1>My App Title</h1>
        </Container>
      </ui.Header>
      <main>{children}</main>
    </body>
  );
};

export default Layout;