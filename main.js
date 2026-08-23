import React from 'react';

const FormPage = ({ loading, error, data }) => {
  // Early return for loading state (no main landmark here)
  if (loading) {
    return <div>Loading...</div>;
  }

  // Single main landmark wrapping all content
  return (
    <main>
      {error ? (
        <section>
          <h1>Error</h1>
          <p>{error}</p>
        </section>
      ) : data ? (
        <article>
          <h1>Success</h1>
          <p>{data}</p>
        </article>
      ) : null}
    </main>
  );
};

export default FormPage;