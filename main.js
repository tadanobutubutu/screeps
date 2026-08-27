tsx
// Import necessary dependencies and components

// ...

export function Dashboard() {
  // ... Existing code and state ...

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Your existing code here, except ... */}

      {/* Instead of rendering two main elements, wrap the error state-related components inside a <section> */}
      {error && (
        <section>
          <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
          {/* ... error-related components ... */}
        </section>
      )}

      {/* The main component should be outside any conditional block */}
      <main>
        {/* Your existing code here, especially success state components ... */}
      </main>
    </div>
  );
}