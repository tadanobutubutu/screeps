import React from 'react';
import { Body, Main } from './components';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Body>
        <Main>{children}</Main>
      </Body>
    </div>
  );
};

export default App;