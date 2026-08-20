const React = require('react');

function MainPage({
  loading,
  error,
  stats,
  refreshing,
  lastUpdated,
  onRefresh,
  onCopy,
  copied,
  onRetry,
  errCopyHover,
  errRetryHover,
  onErrCopyHoverIn,
  onErrCopyHoverOut,
  onErrRetryHoverIn,
  onErrRetryHoverOut,
}) {
  if (loading) {
    return React.createElement(
      'main',
      { style: { padding: '2rem', fontFamily: 'monospace' } },
      React.createElement('h1', null, '🔄 読み込み中...'),
      React.createElement('div', { 'aria-label': '読み込み中インジケーター' })
    );
  }

  return React.createElement(
    'main',
    { style: { padding: '2rem', fontFamily: 'monospace' } },
    error
      ? React.createElement(
          'div',
          null,
          React.createElement(
            'h1',
            { style: { color: '#b71c1c' } },
            '⚠️ エラー'
          ),
          React.createElement(
            'pre',
            {
              tabIndex: 0,
              'aria-label': 'エラーメッセージ詳細',
              style: {
                color: '#c53030',
                backgroundColor: '#fff5f5',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
              },
            },
            error
          ),
          React.createElement(
            'button',
            {
              onClick: onRetry,
              onMouseEnter: onErrRetryHoverIn,
              onMouseLeave: onErrRetryHoverOut,
              onFocus: onErrRetryHoverIn,
              onBlur: onErrRetryHoverOut,
              style: {
                backgroundColor: '#004b73',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                boxShadow: errRetryHover
                  ? '0 4px 10px rgba(0, 75, 115, 0.3)'
                  : 'none',
                filter: errRetryHover ? 'brightness(1.1)' : 'none',
              },
            },
            '🔄 再試行'
          )
        )
      : React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' } },
            React.createElement('h1', null, '📊 Screeps 統計情報'),
            React.createElement(
              'button',
              {
                onClick: onCopy,
                onMouseEnter: onErrCopyHoverIn,
                onMouseLeave: onErrCopyHoverOut,
                onFocus: onErrCopyHoverIn,
                onBlur: onErrCopyHoverOut,
                'aria-label': copied ? 'コピー済み' : '統計情報をコピー',
                title: copied ? 'コピー済み' : '統計情報をコピー',
                disabled: refreshing,
                style: {
                  backgroundColor: copied ? '#155d27' : '#004b73',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  transform: errCopyHover ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: errCopyHover
                    ? '0 4px 10px rgba(0, 75, 115, 0.3)'
                    : 'none',
                  filter: errCopyHover ? 'brightness(1.1)' : 'none',
                  opacity: refreshing ? 0.6 : 1,
                },
              },
              copied ? '✅ コピー完了' : '📋 クリップボードにコピー'
            )
          ),
          lastUpdated &&
            React.createElement(
              'p',
              { style: { color: '#666', fontSize: '0.875rem', marginBottom: '1rem' } },
              `最終更新: ${lastUpdated}`
            ),
          React.createElement(
            'div',
            { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' } },
            [
              { label: '🟢 オンライン', value: stats.online, color: '#22c55e' },
              { label: '🔴 オフライン', value: stats.offline, color: '#ef4444' },
              { label: '⏸️ サスペンド', value: stats.suspended, color: '#f59e0b' },
              { label: '💰 未払い', value: stats.unpaid, color: '#8b5cf6' },
            ].map((item) =>
              React.createElement(
                'div',
                {
                  key: item.label,
                  style: {
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${item.color}`,
                  },
                },
                React.createElement('div', { style: { fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' } }, item.label),
                React.createElement('div', { style: { fontSize: '2rem', fontWeight: 'bold', color: item.color } }, item.value)
              )
            )
          )
        )
  );
}

module.exports = MainPage;