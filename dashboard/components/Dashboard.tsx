"use client";

import { useEffect, useState, useCallback } from "react";

type ScreepsStats = {
  power?: number;
  cpuUsed?: number;
  gcl?: { level: number; progress: number; progressTotal: number };
  rooms?: Record<string, unknown>;
};

export default function Dashboard() {
  const [stats, setStats] = useState<ScreepsStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);

    try {
      const r = await fetch("/api/screeps?endpoint=overview");
      if (!r.ok) throw new Error(`API error: ${r.status}`);
      const data = await r.json();
      setStats(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>🐛 Screeps Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {lastUpdated && (
            <span style={{ fontSize: "0.8rem", color: "#666" }}>
              Last sync: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchStats(true)}
            disabled={loading || isRefreshing}
            aria-label="Refresh stats"
            style={{
              cursor: (loading || isRefreshing) ? "not-allowed" : "pointer",
              padding: "0.5rem 1rem",
              background: "#eee",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          >
            {isRefreshing ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>
      </header>

      <div aria-live="polite">
        {loading && <p>Loading initial stats...</p>}
      </div>

      {error && (
        <div role="alert" style={{ color: "red", padding: "1rem", border: "1px solid red", borderRadius: "4px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <section style={{ opacity: (loading || isRefreshing) ? 0.6 : 1, transition: "opacity 0.2s" }}>
        {stats ? (
          <pre style={{ background: "#f8f8f8", padding: "1rem", borderRadius: "4px", overflow: "auto" }}>
            {JSON.stringify(stats, null, 2)}
          </pre>
        ) : (
          !loading && <p>No data available. Try refreshing.</p>
        )}
      </section>
    </main>
  );
}
