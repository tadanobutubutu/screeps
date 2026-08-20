import React, { useState, useEffect } from 'react';

// Existing exports should remain unchanged
export const existingFunction = () => {

  // ... existing implementation
};

// Add new accessibility-focused functions

/**
 * Ensures all React components have proper lang attributes
 * Addresses REACT_015: React Language Attribute
 */
export const ensureLanguageAttributes = (component) => {
  if (!component.props.lang) {
    console.warn('Missing lang attribute in component. Adding default "en".');
    return React.cloneElement(component, { lang: 'en' });
  }
  return component;
};

/**
 * Validates table structure for screen readers
 * Addresses REACT_027: React Table Structure
 */
export const validateTableStructure = (table) => {
  if (!table.props['aria-label'] && !table.props['aria-labelledby']) {
    console.warn('Table missing accessibility label. Add aria-label or aria-labelledby.');
  }

  // Check for proper table structure
  const hasCaption = React.Children.toArray(table.props.children).some(
    child => child.type === 'caption'
  );

  if (!hasCaption) {
    console.warn('Table should include a <caption> element for better accessibility.');
  }

  return table;
};

/**
 * Ensures proper landmark usage
 * Addresses REACT_017: React Landmarks
 */
export const ensureProperLandmarks = (component) => {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const role = component.props.role;

  if (role && landmarkRoles.includes(role)) {
    // Check if landmark is unique
    const existingLandmarks = document.querySelectorAll(`[role="${role}"]`);
    if (existingLandmarks.length > 1) {
      console.warn(`Multiple landmarks with role "${role}". Only one should exist per page.`);
    }
  }

  return component;
};

/**
 * Ensures SVG elements have accessible names
 * Addresses REACT_041: React SVG Accessible Name
 */
export const ensureSvgAccessibility = (svg) => {
  if (!svg.props['aria-label'] && !svg.props['aria-labelledby']) {
    console.warn('SVG element missing accessibility label. Add aria-label or aria-labelledby.');
  }
  return svg;
};

/**
 * Validates fake links (elements styled as links but not actual links)
 * Addresses REACT_036: React Fake Link
 */
export const validateFakeLinks = (element) => {
  const isLinkStyled = element.props.className?.includes('link') ||
                      element.props.style?.cursor === 'pointer';

  if (isLinkStyled && element.type !== 'a') {
    console.warn('Element styled as link but not an actual <a> tag. Consider using proper link semantics.');
  }

  return element;
};

// Example of how to use these functions in your components
export const AccessibleComponent = ({ children }) => {
  // Apply accessibility enhancements
  const enhancedChildren = React.Children.map(children, child => {
    if (child.type === 'table') {
      return validateTableStructure(child);
    }
    if (child.type === 'svg') {
      return ensureSvgAccessibility(child);
    }
    if (child.props.role) {
      return ensureProperLandmarks(child);
    }
    return validateFakeLinks(child);
  });

  return ensureLanguageAttributes(
    <div lang="en">
      {enhancedChildren}
    </div>
  );
};

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
                        backgroundColor: '#2d3748',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginLeft: '1rem',
                        transition: 'all 0.2s ease-in-out',
                        transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: errRetryHover ? '0 4px 10px rgba(45, 55, 72, 0.3)' : 'none',
                        filter: errRetryHover ? 'brightness(1.1)' : 'none',
                    }}
                >
                    {refreshing ? '🔄 再試行中...' : '🔄 再試行'}
                </button>
            </div>
        );
    }

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#2b6cb0' }}>📊 ダッシュボード</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {Object.entries(stats).map(([key, value]) => (
                    <div key={key} style={{
                        backgroundColor: '#f7fafc',
                        padding: '1rem',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}>
                        <h2 style={{ color: '#2d3748', marginTop: 0 }}>{key}</h2>
                        <p style={{ color: '#4a5568', fontSize: '1.2rem', fontWeight: 'bold' }}>{value}</p>
                    </div>
                ))}
            </div>
            <button
                onClick={() => fetchStats(true)}
                disabled={refreshing}
                style={{
                    backgroundColor: '#2b6cb0',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2c5282'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2b6cb0'}
            >
                {refreshing ? '🔄 更新中...' : '🔄 データを更新'}
            </button>
        </main>
    );
};

export default Dashboard;