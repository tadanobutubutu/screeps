import React, { useState } from 'react';  
import ReactDOM from 'react-dom/client';  

const Dashboard = () => {  
  const [error, setError] = useState('');  
  const [copied, setCopied] = useState(false);  
  const [refreshing, setRefreshing] = useState(false);  

  const handleCopyError = () => {  
    setCopied(true);  
  };  

  const fetchStats = (retry) => {  
    setRefreshing(true);  
    // Implementation omitted for brevity  
  };  

  return (  
    <div className="dashboard">  
      {/* Error state - Fixed: using <section> instead of <main> to comply with REACT_025 */}  
      <section style={{ padding: '2rem', fontFamily: 'monospace' }}>  
        <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>  
        <pre tabIndex={0} aria-label="エラーメッセージ詳細" style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', }} >  
          {error}  
        </pre>  
        <button onClick={handleCopyError} onMouseEnter={() => setCopied(true)} onMouseLeave={() => setCopied(false)} aria-label={copied ? 'コピー済み' : 'エラーをコピー'} title={copied ? 'コピー済み' : 'エラーをコピー'} style={{ backgroundColor: copied ? '#155d27' : '#004b73', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s ease-in-out', transform: copied ? 'scale(1.05)' : 'scale(1)', boxShadow: copied ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none', filter: copied ? 'brightness(1.1)' : 'none', }}>  
          {copied ? '✅ コピー済み' : '📋 エラーをコピー'}  
        </button>  
        <button onClick={() => fetchStats(true)} disabled={refreshing} onMouseEnter={() => setCopied(true)} onMouseLeave={() => setCopied(false)} >  
          再試行  
        </button>  
      </section>  
      {/* Success state - Ensuring consistent landmark type */}  
      <section style={{ padding: '2rem', fontFamily: 'monospace' }}>  
        <h2>成功</h2>  
        <p>処理が完了しました。</p>  
      </section>  
    </div>  
  );  
};  

const App = () => {  
  return (  
    <>  
      {/* Navigation landmark */}  
      <nav id="main-navigation">  
        <ul>  
          <li><a href="#home">Home</a></li>  
          <li><a href="#about">About</a></li>  
        </ul>  
      </nav>  
      <main id="main-content">  
        <h1>Welcome to My App</h1>  
        <p>This is a sample application.</p>  
        {/* Properly structured table */}  
        <table id="data-table">  
          <thead>  
            <tr>  
              <th scope="col" aria-label="Column 1">Name</th>  
              <th scope="col" aria-label="Column 2">Age</th>  
            </tr>  
          </thead>  
          <tbody>  
            <tr>  
              <td><span id="row1-name">Alice</span></td>  
              <td><span id="row1-age">30</span></td>  
            </tr>  
            <tr>  
              <td><span id="row2-name">Bob</span></td>  
              <td><span id="row2-age">25</span></td>  
            </tr>  
          </tbody>  
        </table>  
        {/* Accessible SVG with title */}  
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">  
          <title>User avatar</title>  
          <circle cx="10" cy="10" r="8" stroke="black" stroke-width="2"/>  
        </svg>  
        {/* Non‑link button replaces fake link */}  
        <button onClick={() => alert('Clicked!')}>Click me</button>  
      </main>  
    </>  
  );  
};  

const root = ReactDOM.createRoot(document.getElementById('root'));  
root.render(<App />);