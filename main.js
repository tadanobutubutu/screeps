/**
 * Main application component for the insights dashboard
 * Fetches and displays statistics for commits, branches, and files
 */
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './main.css';

// Mock data and helper functions
const MOCK_COMMIT_STATS = {
  totalCommits: 1247,
  totalAdditions: 45392,
  totalDeletions: 12453,
  totalFilesChanged: 342,
};

const MOCK_BRANCH_STATS = {
  totalBranches: 23,
  activeBranches: 8,
  staleBranches: 15,
  protectedBranches: 5,
};

const MOCK_FILE_STATS = {
  totalFiles: 1847,
  totalDirectories: 89,
  largestFiles: [
    { name: 'src/components/Chart.tsx', lines: 1842 },
    { name: 'src/utils/helpers.js', lines: 1203 },
    { name: 'src/styles/main.css', lines: 892 },
    { name: 'src/pages/Dashboard.tsx', lines: 756 },
    { name: 'src/api/client.ts', lines: 623 },
  ],
};

/**
 * Custom hook for fetching statistics with retry logic
 * @param {boolean} refresh - Trigger to refresh data
 * @returns {Object} - { stats, loading, error, refetch }
 */
function useStats(refresh = false) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call with timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 10000);
        });

        const responsePromise = new Promise((resolve) => {
          // Mock response after random delay
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({
                commitStats: MOCK_COMMIT_STATS,
                branchStats: MOCK_BRANCH_STATS,
                fileStats: MOCK_FILE_STATS,
              }),
            });
          }, 1500);
        });

        const response = await Promise.race([responsePromise, timeoutPromise]);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch statistics');
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [refresh]);

  return { stats, loading, error };
}

/**
 * Formats a number with locale-specific separators
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} - Formatted bytes string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Chart color palette
 */
const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  grid: '#e5e7eb',
  text: '#374151',
};

/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <div className="loading-container" aria-label="Loading statistics">
      <div className="spinner" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="loading-text">Fetching statistics...</p>
    </div>
  );
}

/**
 * Error display component with retry functionality
 */
function ErrorDisplay({ error, onRetry }) {
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = async () => {
    try {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error:', err);
    }
  };

  return (
    <section className="error-container" aria-live="polite">
      <h1 className="error-title" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
      <div className="error-actions">
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
          onClick={onRetry}
          disabled={false}
          onMouseEnter={() => setErrRetryHover(true)}
          onMouseLeave={() => setErrRetryHover(false)}
          onFocus={() => setErrRetryHover(true)}
          onBlur={() => setErrRetryHover(false)}
          aria-label="再試行"
          style={{
            backgroundColor: errRetryHover ? '#5a67d8' : '#4c51bf',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          🔄 再試行
        </button>
      </div>
    </section>
  );
}

/**
 * Statistics card component
 */
function StatCard({ title, value, subtitle, icon, color = CHART_COLORS.primary }) {
  return (
    <article className="stat-card">
      <div className="stat-header">
        <span className="stat-icon" style={{ color }}>{icon}</span>
        <h3 className="stat-title">{title}</h3>
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </article>
  );
}

/**
 * Bar chart component for visualization
 */
function StatsBarChart({ data, title, color = CHART_COLORS.primary }) {
  return (
    <div className="chart-container">
      <h3 style={{ color: CHART_COLORS.text, marginBottom: '1rem' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" stroke={CHART_COLORS.text} />
          <YAxis stroke={CHART_COLORS.text} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
            }}
          />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * File list component
 */
function FileList({ files, title }) {
  return (
    <div className="file-list-container">
      <h3 style={{ color: CHART_COLORS.text, marginBottom: '1rem' }}>{title}</h3>
      <ul className="file-list" role="list">
        {files.map((file, index) => (
          <li key={index} className="file-item">
            <span className="file-rank">{index + 1}</span>
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-lines">{formatNumber(file.lines)} lines</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyState({ message = 'No data available' }) {
  return (
    <section className="empty-state" aria-live="polite">
      <div className="empty-icon">📊</div>
      <h2 className="empty-title">No Statistics Available</h2>
      <p className="empty-message">{message}</p>
    </section>
  );
}

/**
 * Main Statistics Dashboard Component
 * Fetches and displays commit, branch, and file statistics
 */
function InsightsDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [