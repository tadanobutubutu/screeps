// Main component file - Fixed REACT_025 (React Unique Landmarks)
// Replaced multiple <main> elements with semantic <section> elements

export function Main({ children }) {
  return <main>{children}</main>;
}

export function ErrorFallback({ error, onRetry }) {
  if (!error) {
    return null;
  }

  return (
    <section aria-label="エラー表示" role="alert">
      <h1>エラーが発生しました</h1>
      <p>{error.message || String(error)}</p>
      {onRetry && (
        <button onClick={onRetry}>
          再試行
        </button>
      )}
    </section>
  );
}

export function LoadingState() {
  return (
    <section aria-label="読み込み中" aria-busy="true">
      <p>読み込み中...</p>
    </section>
  );
}

export function EmptyState({ message }) {
  return (
    <section aria-label="データなし">
      <p>{message || 'データがありません'}</p>
    </section>
  );
}

export function DataDisplay({ data }) {
  return (
    <section aria-label="データ表示">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}