export function main({ isError, errorMessage, content }) {
  // Error state return path
  if (isError) {
    return (
      <div role="main" style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1>Error</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  // Success state return path
  return (
    <div role="main" style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Success</h1>
      <div>{content}</div>
    </div>
  );
}