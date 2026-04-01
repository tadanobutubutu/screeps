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
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!stats) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(stats, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [stats]);

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
    <main style={{ fontFamily: "monospace", padding: "clamp(1rem, 5vw, 2rem)" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}><span role="img" aria-label="Screeps" title="Screeps">🐛</span> Screeps Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {lastUpdated && (
            <span
              style={{ fontSize: "0.8rem", color: "#666" }}
              title={lastUpdated.toLocaleString()}
            >
              Last sync: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchStats(true)}
            disabled={loading || isRefreshing}
            aria-label={isRefreshing ? "Refreshing stats" : "Refresh stats"}
            title="Refresh stats"
            style={{
              cursor: (loading || isRefreshing) ? "not-allowed" : "pointer",
              padding: "0.5rem 1rem",
              background: "#0077aa",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              opacity: (loading || isRefreshing) ? 0.6 : 1,
              transition: "opacity 0.2s"
            }}
          >
            🔄 {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <div aria-live="polite" style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
        {isRefreshing ? "Refreshing statistics..." : ""}
        {copied ? "JSON copied to clipboard" : ""}
      </div>

      <div aria-live="polite">
        {loading && (
          <section
            aria-busy="true"
            aria-label="Loading GCL stats"
            style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #eee", borderRadius: "4px", opacity: 0.6 }}
          >
            <span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
              Loading GCL stats...
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "120px", height: "1.2rem", background: "#767676", borderRadius: "4px" }} />
                <div style={{ width: "80px", height: "0.9rem", background: "#888888", borderRadius: "4px" }} />
              </div>
              <div style={{ width: "40px", height: "1.2rem", background: "#767676", borderRadius: "4px" }} />
            </div>
            <div style={{ width: "100%", height: "12px", background: "#767676", borderRadius: "6px", marginBottom: "0.5rem" }} />
            <div style={{ width: "150px", height: "0.75rem", background: "#888888", borderRadius: "4px", marginLeft: "auto" }} />
          </section>
        )}
      </div>

      {error && (
        <div role="alert" style={{ color: "#d32f2f", padding: "1rem", border: "1px solid #d32f2f", borderRadius: "4px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#fff5f5" }}>
          <span role="img" aria-label="Error">⚠️</span> {error}
        </div>
      )}

      {stats?.gcl && (
        <section style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid #eee",
          borderRadius: "4px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          transition: "all 0.2s ease-in-out"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <strong><span role="img" aria-label="Global Control Level" title="Global Control Level">🌐</span> GCL: {stats.gcl.level}</strong>
              {stats.power !== undefined && <span style={{ fontSize: "0.9rem", color: "#888" }}><span role="img" aria-label="Power" title="Power">⚡</span> Power: {stats.power}</span>}
            </div>
            <span id="gcl-percent" style={{ fontWeight: "bold", color: "#0077aa" }}>{Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Global Control Level progress"
            aria-describedby="gcl-percent"
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

      <section style={{
        opacity: (loading || isRefreshing) ? 0.6 : 1,
        transition: "opacity 0.2s"
      }}>
        {stats && Object.keys(stats).length > 0 ? (
          <div style={{
            position: "relative",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            transition: "all 0.2s ease-in-out",
            borderRadius: "4px"
          }}>
            <button
              onClick={handleCopy}
              aria-label={copied ? "Stats copied" : "Copy stats as JSON"}
              title="Copy to clipboard"
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                padding: "0.25rem 0.5rem",
                fontSize: "0.75rem",
                background: copied ? "#28a745" : "#5a6268",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              {copied ? "✅ Copied!" : "📋 Copy JSON"}
            </button>
            <pre style={{ background: "#f8f8f8", padding: "1rem", borderRadius: "4px", overflow: "auto" }}>
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        ) : (
          !loading && (
            <p style={{ textAlign: "center", color: "#666", padding: "3rem 1rem" }}>
              <span role="img" aria-label="Ghost">👻</span> No data available. Try refreshing.
            </p>
          )
        )}
      </section>
    </main>
  );
}
