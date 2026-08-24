tsx
// dashboard/components/Dashboard.tsx:320
import React, { useState, useEffect } from 'react';

// Existing code

// Remove the main element in the error state return path
<div style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
    <button
        // ... remaining code
    />
</div>

// Remove <main> in the success state return path
// or replace it with <section> or <article> if needed