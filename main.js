import React, { useState } from 'react';

export function App() {
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);

  const copyErr = () => {
    // copy error logic
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasError) {
    return (
      <div style={{ padding: '2rem' }}>
        <main>
          <h1>メインコンテンツ</h1>
          <p>ここにメインのコンテンツが表示されます。</p>
        </main>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <section aria-labelledby="error-heading">
        <h1 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
        <pre tabIndex={0} aria-label="エラーメッセージ詳細" style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', }}>
          {error}
        </pre>
        <button onClick={copyErr} onMouseEnter={() => setErrCopyHover(true)} onMouseLeave={() => setErrCopyHover(false)} onFocus={() => setErrCopyHover(true)} onBlur={() => setErrCopyHover(false)} aria-label={copied ? 'コピー済み' : 'エラーをコピー'} title={copied ? 'コピー済み' : 'エラーをコピー'} style={{ backgroundColor: copied ? '#155d27' : '#004b73', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s ease-in-out', transform: errCopyHover ? 'scale(1.05)' : 'scale(1)', boxShadow: errCopyHover ? '0 4px 10px rgba(0, 75, 1