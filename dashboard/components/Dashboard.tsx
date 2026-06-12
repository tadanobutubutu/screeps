"use client";
import { useEffect, useState } from "react";

// ダッシュボードコンポーネント: Screepsのステータスを表示し、エラー時はコピー機能を提供します。
export default function Dashboard() {
    const [stats, setStats] = useState<any>(null), [error, setError] = useState<string | null>(null), [loading, setLoading] = useState(true), [copied, setCopied] = useState(false);
    useEffect(() => {
        fetch('/api/screeps?endpoint=overview').then(async (r) => {
            const d = await r.json();
            if (!r.ok || d.error) throw new Error(d.error || `Error: ${r.status}`);
            return d;
        }).then(d => { setStats(d); setLoading(false); }).catch(e => { setError(e.message || String(e)); setLoading(false); });
    }, []);
    // エラーメッセージをクリップボードにコピーする関数
    const copyErr = () => error && navigator.clipboard.writeText(error).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });

    if (loading) return <p aria-live="polite" style={{ padding: '2rem', fontFamily: 'monospace' }}>読み込み中...</p>;
    if (error) return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
            <pre style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '1rem', borderRadius: '4px' }}>{error}</pre>
            <button onClick={copyErr} aria-label={copied ? 'コピー済み' : 'エラーをコピー'} style={{ backgroundColor: copied ? '#155d27' : '#004b73', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
            </button>
        </main>
    );
    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#004b73' }}>🐛 Screeps ダッシュボード</h1>
            <pre style={{ backgroundColor: '#f7fafc', padding: '1rem', borderRadius: '4px' }}>{JSON.stringify(stats, null, 2)}</pre>
        </main>
    );
}
