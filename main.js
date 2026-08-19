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
      
      {!isLoading && !error && data && (
        <section aria-label="Main content">
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          {/* Updated table headers with scope attribute */}
          <table>
            <thead>
              <tr>
                <th scope="col">Column 1</th>
                <th scope="col">Column 2</th>
                <th scope="col">Column 3</th>
                {/* ... other columns ... */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Row 1, Cell 1</td>
                <td>Row 1, Cell 2</td>
                <td>Row 1, Cell 3</td>
                {/* ... other cells ... */}
              </tr>
              {/* ... other rows ... */}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}