export function DataView({ data, isLoading, error }) {
  return (
    <main>
      {isLoading && (
        <section aria-busy="true" aria-label="Loading content">
          <p>Loading...</p>
        </section>
      )}

      {error && (
        <section role="alert" aria-label="Error message">
          <p>Error: {error}</p>
        </section>
      )}

      {!(isLoading || error) && data && (
        <section aria-label="Main content">
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          <button id="unrotate" onClick={() => window.history.back()}>
            rotate back
          </button>
        </section>
      )}
    </main>
  );
}
```

In the original code, the condition `!isLoading && !error && data` checks if data is Present, and neither isLoading nor error is true. In the addition, the condition checks !(isLoading || error), which means if neither isLoading nor error is true, regardless of whether data is present or not. I combined these conditions into a more general and inclusive formulation with a single negation `!(isLoading || error) && data`.