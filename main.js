import React, { useState, useEffect, useCallback } from 'react';

// Fix for REACT_015: Ensure the HTML element has a lang attribute for accessibility.
function ensureLangAttribute() {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (!html.getAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
  }
}

// Run immediately if in a browser environment
if (typeof window !== 'undefined') {
  ensureLangAttribute();
}

// ... existing code ...

const StatsPanel = ({ apiEndpoint, title = '統計' }) => {
    // ... existing state and hooks ...
    
    // Remove the duplicate <main> elements and use a single <main> with conditional content
    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            {error ? (
                // Error state - use div instead of main
                <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
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
                        onClick={copyErr}
                        onMouseEnter={() => setErrCopyHover(true)}
                        onMouseLeave={() => setErrCopyHover(false)}
                        onFocus={() => setErrCopyHover(true)}
                        onBlur={() => setErrCopyHover(false)}
                        aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
                        title={copied ? 'コピー済み' : 'エラーをコピー'}
                        style={{
                            backgroundColor: copied ? '#155d27' : '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            transform: errCopyHover ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: errCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                            filter: errCopyHover ? 'brightness(1.1)' : 'none',
                        }}
                    >
                        {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
                    </button>
                    <button
                        onClick={() => fetchStats(true)}
                        disabled={refreshing}
                        onMouseEnter={() => setErrRetryHover(true)}
                        onMouseLeave={() => setErrRetryHover(false)}
                        style={{
                            backgroundColor: refreshing ? '#ccc' : '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: refreshing ? 'not-allowed' : 'pointer',
                            marginLeft: '0.5rem',
                        }}
                    >
                        {refreshing ? '🔄 リトライ中...' : '🔄 リトライ'}
                    </button>
                </div>
            ) : loading && !refreshing ? (
                // Loading state
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem' }}>🔄 読み込み中...</div>
                </div>
            ) : !loading && !stats ? (
                // No stats available
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '1.5rem', color: '#666' }}>統計データがありません</div>
                    <button
                        onClick={() => fetchStats(true)}
                        style={{
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '1rem',
                        }}
                    >
                        統計を取得
                    </button>
                </div>
            ) : (
                // Success state - use div instead of main
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>{title}</h1>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        {/* Existing stats cards */}
                    </div>
                    <button
                        onClick={() => fetchStats(true)}
                        disabled={refreshing}
                        style={{
                            backgroundColor: refreshing ? '#ccc' : '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: refreshing ? 'not-allowed' : 'pointer',
                            marginTop: '1rem',
                        }}
                    >
                        {refreshing ? '🔄 更新中...' : '🔄 更新'}
                    </button>
                </div>
            )}
        </main>
    );
};

export default StatsPanel;