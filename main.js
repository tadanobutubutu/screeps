export default function Main({ children, error, isLoading }) {
  if (isLoading) {
    return (
      <main>
        <div>Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="error-container">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      {children}
    </main>
  );
}