tsx
import React, { useState } from 'react';

// (Assuming the rest of your component code is here)

// Replace the proper error state returnpath
if (error) {
  return (
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
      {/* Existing buttons */}
    </section>
  );
}

// No change in success state returnpath
if (stats) {
  return <main style={{ padding: '2rem', fontFamily: 'monospace' }}>{/* Existing content */}</main>;
}

// Rest of your component code