// This appears to be a placeholder response from the issue template.
// The actual fix needs to be applied to the Dashboard.tsx files.

// Here's the fix for the issue:

/*
In both files:
- components/Dashboard.tsx (line 320)
- dashboard/components/Dashboard.tsx (line 320)

Change the error state return path from <main> to <section>:

BEFORE:
return (
  <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
    <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
    ...
  </main>
);

AFTER:
return (
  <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
    <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
    ...
  </section>
);

Keep the success state return path using <main> as the primary landmark.
*/