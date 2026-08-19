import React, { useState, useEffect } from 'react';

// ============================================
// Accessibility Utilities (from HEAD)
// ============================================

// Add main landmark components for React accessibility
const MainLandmark = ({ children }) => {
  return <main>{children}</main>;
};

// Add main landmark for HTML files
const addMainLandmarkToHTML = (htmlContent) => {
  // Check if main landmark already exists
  if (htmlContent.includes('<main>')) {
    return htmlContent;
  }

  // Find the body tag and wrap content in main
  const bodyStart = htmlContent.indexOf('<body>');
  if (bodyStart === -1) return htmlContent;

  const bodyEnd = htmlContent.indexOf('</body>', bodyStart);
  if (bodyEnd === -1) return htmlContent;

  const contentBefore = htmlContent.substring(0, bodyStart + 6);
  const contentAfter = htmlContent.substring(bodyEnd);

  return `${contentBefore}<main>${htmlContent.substring(bodyStart + 6, bodyEnd)}</main>${contentAfter}`;
};

// Add function to handle SVG accessibility
const makeSvgAccessible = (svgElement) => {
  // If SVG is decorative, add aria-hidden
  if (svgElement.props.decorative) {
    return React.cloneElement(svgElement, { 'aria-hidden': 'true' });
  }

  // If SVG has a title, keep it as is
  if (svgElement.props.children && React.Children.toArray(svgElement.props.children).some(child =>
    child.type === 'title' || child.props?.['aria-label']
  )) {
    return svgElement;
  }

  // Otherwise, add a default aria-label
  return React.cloneElement(svgElement, {
    'aria-label': svgElement.props['aria-label'] || 'Graphic element'
  });
};

// Add function to safely render main landmark in conditional rendering scenarios
const ConditionalMainLandmark = ({ children, condition, fallback }) => {
  if (condition) {
    return <main>{children}</main>;
  }
  return fallback ? <section>{fallback}</section> : null;
};

// Add function to ensure HTML has language attribute
const ensureHtmlLangAttribute = (htmlContent) => {
  // Check if html tag already has lang attribute
  if (htmlContent.includes('<html lang=')) {
    return htmlContent;
  }

  // Find the html tag and add lang attribute
  const htmlStart = htmlContent.indexOf('<html');
  if (htmlStart === -1) return htmlContent;

  // Insert lang attribute right after <html
  return htmlContent.substring(0, htmlStart + 5) + ' lang="en"' + htmlContent.substring(htmlStart + 5);
};

// ============================================
// Dashboard Component (from origin/main)
// ============================================

const Dashboard = ({ stats, error, refreshing, fetchStats }) => {
    const [copied, setCopied] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);

    const copyErr = () => {
        navigator.clipboard.writeText(error);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (error) {
        return (
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
                    aria-label="再試行"
                    title="再試行"
                    style={{
                        backgroundColor: '#004b73',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                        filter: errRetryHover ? 'brightness(1.1)' : 'none',
                        marginLeft: '1rem'
                    }}
                >
                    {refreshing ? '🔄 再試行中...' : '🔄 再試行'}
                </button>
            </div>
        );
    }

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#004b73' }}>📊 ダッシュボード</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {Object.entries(stats).map(([key, value]) => (
                    <div key={key} style={{
                        backgroundColor: '#f7fafc',
                        borderRadius: '8px',
                        padding: '1rem',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{ color: '#2b6cb0', marginTop: 0 }}>{key}</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c5282' }}>{value}</p>
                    </div>
                ))}
            </div>
            <button
                onClick={() => fetchStats(true)}
                disabled={refreshing}
                style={{
                    marginTop: '2rem',
                    backgroundColor: '#004b73',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    transform: refreshing ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: refreshing ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                    filter: refreshing ? 'brightness(1.1)' : 'none'
                }}
            >
                {refreshing ? '🔄 更新中...' : '🔄 データを更新'}
            </button>
        </main>
    );
};

// ============================================
// Exports
// ============================================

export default Dashboard;
export { 
  MainLandmark, 
  addMainLandmarkToHTML, 
  makeSvgAccessible, 
  ConditionalMainLandmark, 
  ensureHtmlLangAttribute 
};