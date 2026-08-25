tsx
import React from 'react';

interface DashboardProps {
  error?: string;
  copied: boolean;
  errCopyHover: boolean;
  errRetryHover: boolean;
  refreshing: boolean;
  copyErr: () => void;
  fetchStats: (force?: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  error,
  copied,
  errCopyHover,
  errRetryHover,
  refreshing,
  copyErr,
  fetchStats,
}) => {
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
      >
        {refreshing ? '🔄 リフレッシュ中...' : '🔄 リフレッシュ'}
      </button>
      {/* Remove the duplicate <main> elements */}
      {/* <main>...</main> */}
    </div>
  );
};

export default Dashboard;

// FUNCTIONS TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
function fixAccessibilityIssues() {
  // ... existing fixAccessibilityIssues function ...
}

// FUNCTION TO ADD A DECORATIVE SVG ALT TEXT
function addSvgAltText(svgElement) {
  // ... existing addSvgAltText function ...
}

// FUNCTION TO ADD LANG ATTRIBUTE
function addLangAttribute(element) {
  // ... existing addLangAttribute function ...
}

// ADD THE FUNCTION TO ADD MAIN LANDMARK
function addMainLandmark(element) {
  // ... existing addMainLandmark function ...
}

// ADD THE FUNCTION TO ENSURE UNIQUE LANDMARK IDs
function ensureUniqueLandmarkIds() {
  // ... existing ensureUniqueLandmarkIds function ...
}

// ADD THE FUNCTION TO ADD ACCESSIBLE NAMES TO SVGs
function addSvgAccessibleNames(svgElement) {
  // ... existing addSvgAccessibleNames function ...
}

// ADD THE FUNCTION TO FIX FAKE LINK ISSUES
function fixFakeLinkIssue(linkElement) {
  // ... existing fixFakeLinkIssue function ...
}

// ADD THE FUNCTION TO HANDLE UNIQUE LANDMARK NAMES (For REACT_025)
function ensureUniqueLandmarkNames() {
  const landmarks = document.querySelectorAll('[role="landmark"]');
  const landmarkNames = new Set();

  landmarks.forEach((landmark) => {
    const landmarkName = landmark.getAttribute('aria-label');

    if (landmarkName && !landmarkNames.has(landmarkName)) {
      landmarkNames.add(landmarkName);
    } else {
      // Generate a unique id and add to the landmark
      const id = Math.floor(Math.random() * 100000);
      landmark.setAttribute('aria-label', `${landmarkName} - ${id}`);
    }
  });
}

export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addSvgAltText,
  fixAccessibilityIssues,
  ensureUniqueLandmarkIds,
  ensureUniqueLandmarkNames
};