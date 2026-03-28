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
              background: "#00aaff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              opacity: (loading || isRefreshing) ? 0.7 : 1,
              transition: "opacity 0.2s"
            }}
          >
            {isRefreshing ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>
      </header>

      <div aria-live="polite">
        {loading && (
          <div style={{ height: "100px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
            Loading GCL stats...
          </div>
        )}
      </div>

      {error && (
        <div role="alert" style={{ color: "red", padding: "1rem", border: "1px solid red", borderRadius: "4px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {stats?.gcl && (
        <section style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #eee", borderRadius: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <strong>🌐 GCL: {stats.gcl.level}</strong>
              {stats.power !== undefined && <span style={{ fontSize: "0.9rem", color: "#888" }}>⚡ Power: {stats.power}</span>}
            </div>
            <span style={{ fontWeight: "bold", color: "#00aaff" }}>{Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Global Control Level progress"
            aria-valuenow={Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: "100%", height: "12px", background: "#eee", borderRadius: "6px", overflow: "hidden", marginBottom: "0.5rem" }}
          >
            <div style={{ width: `${(stats.gcl.progress / stats.gcl.progressTotal) * 100}%`, height: "100%", background: "#00aaff", transition: "width 0.5s ease-in-out" }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "#777", textAlign: "right" }}>
            {stats.gcl.progress.toLocaleString()} / {stats.gcl.progressTotal.toLocaleString()}
          </div>
        </section>
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
