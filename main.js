tsx
import React from 'react';

// ... (existing imports and code, up to line 320)

const ErrorSection = () => (
  <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
    <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
    <pre
        tabIndex={0}
        aria-label="エラーメッセージ詳細"
        style={{
          color: '#c53030',
          backgroundColor: '#fff5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
        }}
    >
        {error}
    </pre>
    // ... (remaining error section code)
  </section>
);

const SuccessSection = () => (
  <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
    // ... (remaining success section code)
  </section>
);

// ... (remaining code and exports)