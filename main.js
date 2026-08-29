import './styles.css';

import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

// Function to create in-page buttons
const createInPageButton = (options: {
  onClick: () => void;
  label: string;
  icon: string;
  disabled?: boolean;
  isActive?: boolean;
  hoverState: boolean;
  setHoverState: (value: boolean) => void;
  ariaLabel?: string;
  title?: string;
}) => {
  const { onClick, label, icon, disabled = false, isActive = false, hoverState, setHoverState, ariaLabel, title } = options;

  const getBackgroundColor = () => {
    if (disabled) return '#999';
    if (isActive) return '#155d27';
    return '#004b73';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel || label}
      aria-pressed={isActive}
      title={title || label}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      onFocus={() => setHoverState(true)}
      onBlur={() => setHoverState(false)}
      style={{
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease-in-out',
        transform: hoverState ? 'scale(1.05)' : 'scale(1)',
        boxShadow: hoverState ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
        filter: hoverState ? 'brightness(1.1)' : 'none',
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span> {label}</span>
    </button>
  );
};

const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errCopyHover, setErrCopyHover] = useState<boolean>(false);
  const [errRetryHover, setErrRetryHover] = useState<boolean>(false);

  const copyErr = () => {
    // Implement the copy error logic
    setCopied(true);
    // Reset copied state after some time
    setTimeout(() => setCopied(false), 3000);
  };

  const fetchStats = (shouldRetry: boolean) => {
    // Implement the fetch stats logic
    setRefreshing(true);
    // Reset refreshing state after some time
    setTimeout(() => setRefreshing(false), 20000);
  };

  return (
    <main role="main" ...>
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
        {createInPageButton({
          onClick: copyErr,
          label: copied ? 'コピー済み' : 'エラーをコピー',
          icon: copied ? icons.success : icons.copy,
          disabled: false,
          isActive: copied,
          hoverState: errCopyHover,
          setHoverState: setErrCopyHover,
          ariaLabel: copied ? 'コピー済み' : 'エラーをコピー',
          title: copied ? 'コピー済み' : 'エラーをコピー',
        })}
        {createInPageButton({
          onClick: () => fetchStats(true),
          label: refreshing ? '再試行中...' : '再試行',
          icon: refreshing ? icons.refresh : icons.retry,
          disabled: refreshing,
          isActive: false,
          hoverState: errRetryHover,
          setHoverState: setErrRetryHover,
          ariaLabel: refreshing ? '再試行中...' : 'エラーの再試行',
          title: refreshing ? '再試行中...' : 'エラーの再試行',
        })}
      </div>
    </main>
  );
};

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = landmark.name + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Testing the checkLandmarkElement function:
// To test this function, we could create a test file with the following content:
const landmarkStructureCheck = (landmark) => {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

/**
 * Initializes the application and applies accessibility fixes.
 */
const initApp = () => {
  // Initialize the main application
  initializeApp();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  ensureUniqueLandmarks(landmarks);

  // Add accessible names to SVGs (example selectors and names)
  const icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screps icon"></svg>',
    success: '<svg viewBox="0 0 100 100" aria-label="Success icon"></svg>',
    copy: '<svg viewBox="0 0 100 100" aria-label="Copy icon"></svg>',
    refresh: '<svg viewBox="0 0 100 100" aria-label="Refresh icon"></svg>',
    retry: '<svg viewBox="0 0 100 100" aria-label="Retry icon"></svg>',
  };

  // Fix fake links
  fixFakeLinks();

  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
  // ... (assuming other initialization logic is present)
};

// Check if the environment is secure before initializing
if (isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

// Register the service worker
registerSW();

// Export functions for testing
// ... (only include exported functions if needed and remove unrelated code)