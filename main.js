import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in the page, load the following setup
// just for development, or send it to a analytics endpoint. More info: https://bit.ly/CRA-vitals
reportWebVitals();

function addLangAttribute() {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('lang', 'en');
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headerRow = table.querySelector('thead tr');
    if (headerRow && !headerRow.querySelector('th, th')) {
      const cells = headerRow.querySelectorAll('td');
      cells.forEach(cell => {
        const th = document.createElement('th');
        th.innerHTML = cell.innerHTML;
        cell.innerHTML = '';
        cell.parentNode.replaceChild(th, cell);
      });
    }
  });
}

function addMainLandmark() {
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.hasAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }
}

function fixVisibilityOnHood() {
  const elements = document.querySelectorAll('[class*="Hood"]');
  elements.forEach(el => {
    if (window.getComputedStyle(el).visibility === 'hidden') {
      el.style.visibility = 'visible';
    }
  });
}

function fixVisibilityOn sunglasses {
  const elements = document.querySelectorAll('[class*="Óculos"]');
  elements.forEach(el => {
    if (window.getComputedStyle(el).visibility === 'hidden') {
      el.style.visibility = 'visible';
    }
  });
}

function fixVisibilityOnDarkSunglasses() {
  const elements = document.querySelectorAll('[class*="escuros"]');
  elements.forEach(el => {
    if (window.getComputedStyle(el).visibility === 'hidden') {
      el.style.visibility = 'visible';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  fixVisibilityOnHood();
  fixVisibilityOnSunglasses();
  fixVisibilityOnDarkSunglasses();
});

  const fetchStats = (shouldRetry) => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <main role="main" aria-label="Dashboard">
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
        {error && (
          <section
            role="alert"
            aria-label="エラーメッセージ詳細"
            aria-live="polite"
            style={{
              color: '#c53030',
              backgroundColor: '#fff5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {error}
          </section>
        )}
        <button
          type="button"
          onClick={copyErr}
          onMouseEnter={() => setErrCopyHover(true)}
          onMouseLeave={() => setErrCopyHover(false)}
          onFocus={() => setErrCopyHover(true)}
          onBlur={() => setErrCopyHover(false)}
          aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
          aria-pressed={copied}
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
          <span>{copied ? '✅' : '📋'}</span>
          <span> {copied ? 'コピー済み' : 'エラーをコピー'}</span>
        </button>
        <button
          type="button"
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          aria-disabled={refreshing}
          aria-busy={refreshing}
          aria-label={refreshing ? '再試行中...' : 'エラーの再試行'}
          title={refreshing ? '再試行中...' : 'エラーの再試行'}
          onMouseEnter={() => setErrRetryHover(true)}
          onMouseLeave={() => setErrRetryHover(false)}
          onFocus={() => setErrRetryHover(true)}
          onBlur={() => setErrRetryHover(false)}
          style={{
            backgroundColor: refreshing ? '#999' : '#004b73',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            opacity: refreshing ? 0.6 : 1,
            marginLeft: '0.5rem',
            transition: 'all 0.2s ease-in-out',
            transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
            boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
          }}
        >
          <span>{refreshing ? '🔄' : '🔁'}</span>
          <span> {refreshing ? '再試行中...' : 'エラーの再試行'}</span>
        </button>
      </div>
    </main>
  );
};

export default Dashboard;

// Implement wrapPrimaryContentInMain function, including the added logic
export const wrapPrimaryContentInMain = (content) => {
  return (
    <main role="main" aria-label="Primary Content">
      {content}
    </main>
  );
};