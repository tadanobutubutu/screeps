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
  const [updated, setUpdated] = useState(false);
  const [isJsonFocused, setIsJsonFocused] = useState(false);

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
      if (isManual) {
        setUpdated(true);
        setTimeout(() => setUpdated(false), 2000);
      }
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isR = key === "r";
      const isC = key === "c";
      const hasModifier = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;

      if ((isR || isC) && !hasModifier && !loading && !isRefreshing) {
        const activeElement = document.activeElement;
        const isEditable =
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement ||
          activeElement instanceof HTMLSelectElement ||
          activeElement?.getAttribute("contenteditable") === "true";

        if (!isEditable) {
          e.preventDefault();
          if (isR) fetchStats(true);
          if (isC) handleCopy();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fetchStats, handleCopy, loading, isRefreshing, stats]);

  useEffect(() => {
    let title = "Screeps Dashboard";
    if (loading) title = "⏳ Loading...";
    else if (isRefreshing) title = "🔄 Refreshing...";
    else if (updated) title = "✅ Updated";
    else if (stats?.gcl) {
      const percent = Math.min(100, Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100));
      title = `Screeps (${percent}%)`;
    }
    document.title = title;
  }, [loading, isRefreshing, updated, stats]);

  return (
    <main style={{ fontFamily: "monospace", padding: "clamp(1rem, 5vw, 2rem)", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}><span role="img" aria-label="Screeps" title="Screeps">🐛</span> Screeps Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {stats?.rooms && (
            <span
              style={{ fontSize: "0.9rem", color: "#575757", display: "flex", alignItems: "center", gap: "0.25rem", cursor: "help", borderBottom: "1px dotted #ccc" }}
              title={`Rooms: ${Object.keys(stats.rooms).join(", ")}`}
              tabIndex={0}
            >
              <span role="img" aria-label="Rooms">🏠</span> {Object.keys(stats.rooms).length} Room{Object.keys(stats.rooms).length === 1 ? "" : "s"}
            </span>
          )}
          {lastUpdated && (
            <span
              style={{ fontSize: "0.8rem", color: "#575757", cursor: "help", borderBottom: "1px dotted #ccc" }}
              title={lastUpdated.toLocaleString()}
              tabIndex={0}
            >
              Last sync: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchStats(true)}
            disabled={loading || isRefreshing}
            aria-label={updated ? "Stats updated" : isRefreshing ? "Refreshing stats" : "Refresh stats"}
            aria-keyshortcuts="r"
            title={isRefreshing ? "Refreshing..." : "Refresh stats (R)"}
            style={{
              cursor: (loading || isRefreshing) ? "not-allowed" : "pointer",
              padding: "0.5rem 1rem",
              background: updated ? "#28a745" : "#0077aa",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              opacity: (loading || isRefreshing) ? 0.6 : 1,
              transition: "all 0.2s",
              userSelect: "none"
            }}
          >
            {updated ? "✅ Updated!" : isRefreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
          </button>
        </div>
      </header>

      <div aria-live="polite" style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
        {isRefreshing ? "Refreshing statistics..." : ""}
        {updated ? "Dashboard updated" : ""}
        {copied ? "JSON copied to clipboard" : ""}
      </div>

      <div aria-live="polite">
        {loading && (
          <>
            <section
              aria-busy="true"
              aria-label="Loading GCL stats"
              style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #eee", borderRadius: "4px", opacity: 0.6, boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" }}
            >
              <span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
                Loading GCL stats...
              </span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "120px", height: "1.2rem", background: "#eeeeee", borderRadius: "4px" }} />
                  <div style={{ width: "80px", height: "0.9rem", background: "#eeeeee", borderRadius: "4px" }} />
                </div>
                <div style={{ width: "40px", height: "1.2rem", background: "#eeeeee", borderRadius: "4px" }} />
              </div>
              <div style={{ width: "100%", height: "12px", background: "#eeeeee", borderRadius: "6px", marginBottom: "0.5rem" }} />
              <div style={{ width: "150px", height: "0.75rem", background: "#eeeeee", borderRadius: "4px", marginLeft: "auto" }} />
            </section>
            <section
              aria-busy="true"
              aria-label="Loading raw data"
              style={{ padding: "1rem", border: "1px solid #eee", borderRadius: "4px", opacity: 0.6, boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" }}
            >
              <div style={{ width: "100%", height: "200px", background: "#eeeeee", borderRadius: "4px" }} />
            </section>
          </>
        )}
      </div>

      {error && (
        <div role="alert" style={{ color: "#d32f2f", padding: "1rem", border: "1px solid #d32f2f", borderRadius: "4px", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff5f5" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span role="img" aria-label="Error">⚠️</span> {error}
          </div>
          <button
            onClick={() => fetchStats(true)}
            disabled={loading || isRefreshing}
            aria-label="Retry fetching stats"
            aria-keyshortcuts="r"
            title="Retry (R)"
            style={{
              padding: "0.25rem 0.75rem",
              background: "#d32f2f",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: (loading || isRefreshing) ? "not-allowed" : "pointer",
              fontSize: "0.8rem",
              opacity: (loading || isRefreshing) ? 0.6 : 1,
              transition: "all 0.2s",
              userSelect: "none"
            }}
          >
            {isRefreshing ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      {stats?.gcl && (
        <section style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid #eee",
          borderRadius: "4px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          opacity: (loading || isRefreshing) ? 0.6 : 1,
          transition: "all 0.2s ease-in-out"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <strong><span role="img" aria-label="Global Control Level" title="Global Control Level">🌐</span> GCL: {stats.gcl.level}</strong>
              {stats.power !== undefined && <span style={{ fontSize: "0.9rem", color: "#575757" }}><span role="img" aria-label="Power" title="Power">⚡</span> Power: {stats.power}</span>}
              {stats.cpuUsed !== undefined && <span style={{ fontSize: "0.9rem", color: "#575757" }}><span role="img" aria-label="CPU Used" title="CPU Used">📊</span> CPU: {stats.cpuUsed}</span>}
            </div>
            <span
              id="gcl-percent"
              style={{
                fontWeight: "bold",
                color: stats.gcl.progress >= stats.gcl.progressTotal ? "#FFD700" : "#0077aa",
                backgroundColor: stats.gcl.progress >= stats.gcl.progressTotal ? "#333" : "transparent",
                padding: stats.gcl.progress >= stats.gcl.progressTotal ? "2px 6px" : "0",
                borderRadius: "4px",
                transition: "all 0.3s ease",
              }}
            >
              {Math.min(100, Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100))}%
            </span>
          </div>
          <div
            role="progressbar"
            tabIndex={0}
            aria-label="Global Control Level progress"
            aria-describedby="gcl-percent"
            aria-valuenow={Math.min(100, Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${Math.min(100, Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100))}% complete, ${(stats.gcl.progressTotal - stats.gcl.progress).toLocaleString()} XP remaining to level ${stats.gcl.level + 1}`}
            title={`${(stats.gcl.progressTotal - stats.gcl.progress).toLocaleString()} XP remaining to level ${stats.gcl.level + 1}`}
            style={{ width: "100%", height: "12px", background: stats.gcl.progress >= stats.gcl.progressTotal ? "#333333" : "#eeeeee", borderRadius: "6px", overflow: "hidden", marginBottom: "0.5rem", cursor: "help" }}
          >
            <div style={{ width: `${(stats.gcl.progress / stats.gcl.progressTotal) * 100}%`, height: "100%", background: stats.gcl.progress >= stats.gcl.progressTotal ? "#FFD700" : "#0077aa", transition: "width 0.5s ease-in-out" }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "#575757", textAlign: "right" }}>
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
            boxShadow: isJsonFocused ? "0 0 0 2px #0077aa" : copied ? "0 0 0 2px #28a745" : "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            transition: "all 0.2s ease-in-out",
            borderRadius: "4px"
          }}>
            <button
              onClick={handleCopy}
              aria-label={copied ? "Stats copied" : "Copy stats as JSON"}
              aria-keyshortcuts="c"
              title={copied ? "Copied!" : "Copy to clipboard (C)"}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                padding: "0.25rem 0.5rem",
                fontSize: "0.75rem",
                background: copied ? "#28a745" : "#575757",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s",
                userSelect: "none",
                zIndex: 1
              }}
            >
              {copied ? "✅ Copied!" : "📋 Copy JSON"}
            </button>
            <pre
              aria-label="Screeps statistics JSON"
              tabIndex={0}
              onFocus={() => setIsJsonFocused(true)}
              onBlur={() => setIsJsonFocused(false)}
              style={{
                background: "#f8f8f8",
                padding: "1rem",
                borderRadius: "4px",
                overflow: "auto",
                maxHeight: "500px",
                margin: 0,
                border: "1px solid #eee",
                outline: "none"
              }}
            >
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        ) : (
          !loading && (
            <div style={{ textAlign: "center", color: "#575757", padding: "3rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <p style={{ margin: 0 }}>
                <span role="img" aria-label="Ghost">👻</span> No data available.
              </p>
              <button
                onClick={() => fetchStats(true)}
                disabled={loading || isRefreshing}
                aria-label={updated ? "Stats updated" : isRefreshing ? "Refreshing stats" : "Refresh stats"}
                aria-keyshortcuts="r"
                title="Refresh stats (R)"
                style={{
                  cursor: (loading || isRefreshing) ? "not-allowed" : "pointer",
                  padding: "0.5rem 1rem",
                  background: updated ? "#28a745" : "#0077aa",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  opacity: (loading || isRefreshing) ? 0.6 : 1,
                  transition: "all 0.2s"
                }}
              >
                {updated ? "✅ Updated!" : "🔄 Refresh Dashboard"}
              </button>
            </div>
          )
        )}
      </section>

      <footer style={{ marginTop: "3rem", paddingTop: "1rem", borderTop: "1px solid #eee", fontSize: "0.8rem", color: "#888", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          Keyboard Shortcuts: <kbd style={{ background: "#eee", padding: "0.1rem 0.3rem", borderRadius: "3px", border: "1px solid #ccc" }}>R</kbd> Refresh · <kbd style={{ background: "#eee", padding: "0.1rem 0.3rem", borderRadius: "3px", border: "1px solid #ccc" }}>C</kbd> Copy JSON
        </div>
        <div>
          Hover/Focus items with <span style={{ cursor: "help", borderBottom: "1px dotted #888" }}>dotted underline</span> for details.
        </div>
      </footer>
    </main>
  );
}
