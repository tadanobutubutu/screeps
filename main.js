import React from 'react';
import ErrorPage from './ErrorPage';
import MainContent from './MainContent';

function Main() {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <main>
        <article>
          <h1>Error</h1>
          <p>Something went wrong.</p>
        </article>
      </main>
    );
  }

  return (
    <main>
      <MainContent />
    </main>
  );
}

export default Main;