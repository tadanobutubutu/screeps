tsx
// Before refactor:
// <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
//   <!-- Error state content -->
// </main>
// <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
//   <!-- Success state content -->
// </main>

// After refactor:
// <section aria-labelledby="error-message" style={{ padding: '2rem', fontFamily: 'monospace' }}>
//   <h2 id="error-message">⚠️ エラー</h2>
//   <pre
//     tabIndex={0}
//     aria-label="エラーメッセージ詳細"
//     style={{
//       color: '#c53030',
//       backgroundColor: '#fff5f5',
//       padding: '1rem',
//       borderRadius: '4px',
//       overflow: 'auto',
//     }}
//   >
//     {error}
//   </pre>
//   <!-- ... other error-related elements ... -->
// </section>
// <section aria-labelledby="success-message" style={{ padding: '2rem', fontFamily: 'monospace' }}>
//   <h2 id="success-message">Success Message</h2>
//   <!-- Success state content -->
// </section>