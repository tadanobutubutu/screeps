'use client';
import { useEffect, useState, useCallback, useRef } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null),
        [error, setError] = useState<string | null>(null),
        [loading, setLoading] = useState(true),
        [refreshing, setRefreshing] = useState(false),
        [lastUpdated, setLastUpdated] = useState<Date | null>(null),
        [copied, setCopied] = useState(false),
        [copiedRoom, setCopiedRoom] = useState<string | null>(null),
        [copiedJson, setCopiedJson] = useState(false),
        [detailsOpen, setDetailsOpen] = useState(false),
        [copiedSummary, setCopiedSummary] = useState(false),
        [summaryHover, setSummaryHover] = useState(false);

    const [autoRefresh, setAutoRefresh] = useState(true);
    const [autoRefreshHover, setAutoRefreshHover] = useState(false);
    const [autoRefreshFocused, setAutoRefreshFocused] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [refreshHover, setRefreshHover] = useState(false);
    const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
    const [jsonHover, setJsonHover] = useState(false);
    const [refreshSuccess, setRefreshSuccess] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);
    const [toastCloseFocused, setToastCloseFocused] = useState(false);
    const [copiedAllRooms, setCopiedAllRooms] = useState(false);
    const [copyAllHover, setCopyAllHover] = useState(false);
    const [roomQuery, setRoomQuery] = useState('');

    const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const showToast = (msg: string) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToastMsg(msg);
        toastTimeoutRef.current = setTimeout(() => {
            setToastMsg(null);
            toastTimeoutRef.current = null;
        }, 2500);
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const copySummary = useCallback(() => {
        if (!stats) return;
        const gclStr = stats.gcl
            ? `GCL ${stats.gcl.level} (${((stats.gcl.progress / stats.gcl.progressTotal) * 100).toFixed(2)}%)`
            : 'GCL -';
        const gplStr = stats.power !== undefined ? `GPL ${stats.power}` : 'GPL -';
        const cpuStr = stats.cpuUsed !== undefined ? `CPU ${stats.cpuUsed.toFixed(2)}` : 'CPU -';
        const roomsStr =
            stats.rooms && stats.rooms.length > 0
                ? `Rooms: ${stats.rooms.join(', ')}`
                : 'Rooms: none';
        const summaryText = `🐛 Screeps AI Status | ${gclStr} | ${gplStr} | ${cpuStr} | ${roomsStr}`;

        navigator.clipboard.writeText(summaryText).then(() => {
            setCopiedSummary(true);
            setTimeout(() => setCopiedSummary(false), 2000);
            showToast('ステータスのサマリーをクリップボードにコピーしました');
        });
    }, [stats]);

    const fetchStats = useCallback(async (isManual = false) => {
        if (isManual) setRefreshing(true);
        try {
            const r = await fetch('/api/screeps?endpoint=overview');
            const d = await r.json();
            if (!r.ok || d.error) throw new Error(d.error || `エラー: ${r.status}`);
            setStats(d);
            setLastUpdated(new Date());
            setError(null);
            if (isManual) {
                setRefreshSuccess(true);
                setTimeout(() => setRefreshSuccess(false), 2000);
                showToast('データを最新の状態に更新しました');
            }
        } catch (e: any) {
            setError(e.message || String(e));
            showToast('データの更新に失敗しました');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Auto-refresh interval
    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => {
            if (!document.hidden) {
                fetchStats(false);
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [autoRefresh, fetchStats]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Using Alt key combinations to comply with WCAG 2.1.4 (avoiding single-key shortcuts)
            if (
                e.altKey &&
                !(
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    (e.target as HTMLElement).isContentEditable
                )
            ) {
                if (e.key.toLowerCase() === 'r' && !refreshing) {
                    e.preventDefault();
                    fetchStats(true);
                } else if (e.key.toLowerCase() === 's') {
                    e.preventDefault();
                    searchInputRef.current?.focus();
                } else if (e.key.toLowerCase() === 'd') {
                    e.preventDefault();
                    setDetailsOpen((prev) => !prev);
                } else if (e.key.toLowerCase() === 'c' && stats) {
                    e.preventDefault();
                    copySummary();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [fetchStats, refreshing, copySummary, stats]);

    const copyErr = () =>
        error &&
        navigator.clipboard.writeText(error).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            showToast('エラーメッセージをクリップボードにコピーしました');
        });

    const copyRoom = (room: string) => {
        navigator.clipboard.writeText(room).then(() => {
            setCopiedRoom(room);
            setTimeout(() => setCopiedRoom(null), 2000);
            showToast(`部屋名 ${room} をクリップボードにコピーしました`);
        });
    };

    const copyRawData = () => {
        navigator.clipboard.writeText(JSON.stringify(stats, null, 2)).then(() => {
            setCopiedJson(true);
            setTimeout(() => setCopiedJson(false), 2000);
            showToast('生データをクリップボードにコピーしました');
        });
    };

    const filteredRooms =
        stats?.rooms?.filter((room: string) =>
            room.toLowerCase().includes(roomQuery.toLowerCase())
        ) || [];

    const copyAllRooms = () => {
        if (filteredRooms.length === 0) return;
        const roomsStr = filteredRooms.join(', ');
        navigator.clipboard.writeText(roomsStr).then(() => {
            setCopiedAllRooms(true);
            setTimeout(() => setCopiedAllRooms(false), 2000);
            showToast(
                roomQuery
                    ? 'フィルター結果の部屋名をコピーしました'
                    : 'すべての部屋名をコピーしました'
            );
        });
    };

    if (loading)
        return (
            <div
                aria-live="polite"
                aria-busy="true"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '2rem',
                    fontFamily: 'monospace',
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        animation: 'spin 1s linear infinite',
                        color: '#004b73',
                    }}
                    aria-hidden="true"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="42"
                        style={{ opacity: 0.2 }}
                    />
                    <path
                        d="M12 2 C 6.48 2 2 6.48 2 12"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
                <span style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                    読み込み中...
                </span>
            </div>
        );
    if (error)
        return (
            <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
                    onFocus={() => setErrRetryHover(true)}
                    onBlur={() => setErrRetryHover(false)}
                    aria-label={refreshing ? '読み込み中...' : 'データを再読み込み'}
                    title={refreshing ? '読み込み中...' : 'データを再読み込み'}
                    style={{
                        marginLeft: '1rem',
                        padding: '0.5rem 1rem',
                        cursor: refreshing ? 'not-allowed' : 'pointer',
                        backgroundColor: refreshing ? '#edf2f7' : '#f7fafc',
                        color: refreshing ? '#a0aec0' : 'inherit',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease-in-out',
                        transform: errRetryHover && !refreshing ? 'scale(1.05)' : 'scale(1)',
                        boxShadow:
                            errRetryHover && !refreshing ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                        filter: errRetryHover && !refreshing ? 'brightness(0.95)' : 'none',
                    }}
                >
                    {refreshing ? '読み込み中...' : '🔄 再試行'}
                </button>
            </main>
        );
    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h1 style={{ color: '#004b73', margin: 0 }}>🐛 Screeps ダッシュボード</h1>
                    {stats && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <kbd
                                aria-label="キーボードショートカット Alt + C キーでステータスのサマリーをコピーできます"
                                title="Alt + C キーでサマリーをコピーできます"
                                style={{
                                    backgroundColor: '#f7fafc',
                                    border: '1px solid #cbd5e0',
                                    borderRadius: '4px',
                                    padding: '0.1rem 0.4rem',
                                    fontSize: '0.7rem',
                                    color: '#4a5568',
                                    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                                }}
                            >
                                Alt + C
                            </kbd>
                            <button
                                onClick={copySummary}
                                onMouseEnter={() => setSummaryHover(true)}
                                onMouseLeave={() => setSummaryHover(false)}
                                onFocus={() => setSummaryHover(true)}
                                onBlur={() => setSummaryHover(false)}
                                aria-label={
                                    copiedSummary
                                        ? 'サマリーをコピーしました'
                                        : 'ステータスのサマリーをコピー (Alt + C)'
                                }
                                title={
                                    copiedSummary
                                        ? 'サマリーをコピーしました'
                                        : 'ステータスのサマリーをコピー (Alt + C)'
                                }
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.2rem 0.5rem',
                                    backgroundColor: copiedSummary
                                        ? '#c6f6d5'
                                        : summaryHover
                                          ? '#edf2f7'
                                          : 'transparent',
                                    border: '1px solid #cbd5e0',
                                    borderRadius: '4px',
                                    color: copiedSummary ? '#22543d' : '#4a5568',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    transition: 'all 0.2s ease-in-out',
                                    transform: summaryHover ? 'scale(1.05)' : 'scale(1)',
                                }}
                            >
                                {copiedSummary ? '✅ コピー完了' : '📋 サマリーをコピー'}
                            </button>
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {refreshSuccess && (
                        <span
                            style={{
                                fontSize: '0.8rem',
                                color: '#155d27',
                                backgroundColor: '#c6f6d5',
                                border: '1px solid #cbd5e0',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                animation: 'bounce 0.5s ease-in-out',
                            }}
                            aria-live="polite"
                        >
                            ✅ 更新完了
                        </span>
                    )}
                    {lastUpdated && (
                        <span
                            className="interactive-hint"
                            tabIndex={0}
                            title="最後にデータが更新された時間です"
                            aria-label="最後にデータが更新された時間です"
                            style={{ fontSize: '0.8rem', color: '#718096' }}
                        >
                            🕒 {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label
                            className="auto-refresh-label"
                            onMouseEnter={() => setAutoRefreshHover(true)}
                            onMouseLeave={() => setAutoRefreshHover(false)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                color: '#4a5568',
                                userSelect: 'none',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease-in-out',
                                backgroundColor: autoRefreshFocused
                                    ? 'rgba(0, 75, 115, 0.1)'
                                    : autoRefreshHover
                                      ? '#edf2f7'
                                      : 'transparent',
                                outline: autoRefreshFocused ? '2px solid #004b73' : 'none',
                                outlineOffset: '1px',
                            }}
                            title="60秒ごとに自動でデータを更新します"
                        >
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                onFocus={() => setAutoRefreshFocused(true)}
                                onBlur={() => setAutoRefreshFocused(false)}
                                style={{
                                    cursor: 'pointer',
                                    accentColor: '#004b73',
                                    width: '0.9rem',
                                    height: '0.9rem',
                                }}
                                aria-label="自動更新 (60秒ごと)"
                            />
                            <span
                                style={{
                                    fontWeight: 'normal',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: autoRefresh ? '#48bb78' : '#a0aec0',
                                        animation: autoRefresh
                                            ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                            : 'none',
                                    }}
                                    aria-hidden="true"
                                />
                                自動更新
                            </span>
                        </label>
                        <kbd
                            aria-label="キーボードショートカット Alt + R キーでダッシュボードの更新ができます"
                            title="Alt + R キーで更新できます"
                            style={{
                                backgroundColor: '#f7fafc',
                                border: '1px solid #cbd5e0',
                                borderRadius: '4px',
                                padding: '0.1rem 0.4rem',
                                fontSize: '0.7rem',
                                color: '#4a5568',
                                boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                            }}
                        >
                            Alt + R
                        </kbd>
                        <button
                            onClick={() => fetchStats(true)}
                            disabled={refreshing}
                            onMouseEnter={() => setRefreshHover(true)}
                            onMouseLeave={() => setRefreshHover(false)}
                            onFocus={() => setRefreshHover(true)}
                            onBlur={() => setRefreshHover(false)}
                            aria-label={refreshing ? '更新中...' : '更新 (Alt + R)'}
                            title={refreshing ? '更新中...' : 'データを更新 (Alt + R)'}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: refreshing ? '#edf2f7' : '#004b73',
                                color: refreshing ? '#a0aec0' : 'white',
                                cursor: refreshing ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease-in-out',
                                transform: refreshing
                                    ? 'none'
                                    : refreshHover
                                      ? 'scale(1.15)'
                                      : 'scale(1)',
                                boxShadow:
                                    refreshHover && !refreshing
                                        ? '0 4px 10px rgba(0, 75, 115, 0.4)'
                                        : 'none',
                                filter: refreshHover && !refreshing ? 'brightness(1.1)' : 'none',
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                                }}
                            >
                                🔄
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div
                style={{
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    borderRadius: '8px',
                }}
            >
                <div
                    style={{ marginBottom: '1rem' }}
                    className="interactive-hint"
                    tabIndex={0}
                    title={`GCL ${stats?.gcl?.level || 0} 進捗: ${stats?.gcl?.progress || 0} / ${stats?.gcl?.progressTotal || 0}`}
                    aria-label={`GCL ${stats?.gcl?.level || 0} 進捗: ${stats?.gcl?.progress || 0} / ${stats?.gcl?.progressTotal || 0}`}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.25rem',
                        }}
                    >
                        <span>🌐 GCL: {stats?.gcl?.level}</span>
                        <span style={{ fontSize: '0.85rem' }}>
                            {stats?.gcl?.progress !== undefined &&
                            stats?.gcl?.progressTotal !== undefined
                                ? `${formatNumber(stats.gcl.progress)} / ${formatNumber(stats.gcl.progressTotal)} (`
                                : ''}
                            {stats?.gcl?.progressTotal
                                ? ((stats.gcl.progress / stats.gcl.progressTotal) * 100).toFixed(2)
                                : '0.00'}
                            %
                            {stats?.gcl?.progress !== undefined &&
                            stats?.gcl?.progressTotal !== undefined
                                ? ')'
                                : ''}
                        </span>
                    </div>
                    <div
                        role="progressbar"
                        aria-label="GCLの進捗"
                        aria-valuenow={stats?.gcl?.progress || 0}
                        aria-valuemin={0}
                        aria-valuemax={stats?.gcl?.progressTotal || 100}
                        aria-valuetext={`${stats?.gcl?.progress || 0} / ${stats?.gcl?.progressTotal || 0} (${
                            stats?.gcl?.progressTotal
                                ? ((stats.gcl.progress / stats.gcl.progressTotal) * 100).toFixed(2)
                                : '0.00'
                        }%)`}
                        style={{
                            height: '0.5rem',
                            backgroundColor: '#edf2f7',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                backgroundColor: '#004b73',
                                width: `${
                                    stats?.gcl?.progressTotal
                                        ? (stats.gcl.progress / stats.gcl.progressTotal) * 100
                                        : 0
                                }%`,
                                transition: 'width 0.3s ease-in-out',
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{ marginBottom: '1rem' }}
                    className="interactive-hint"
                    tabIndex={0}
                    title={`CPU 使用率: ${stats?.cpuUsed?.toFixed(2) || '0.00'} / 100 (Screeps の基本制限: 100)`}
                    aria-label={`CPU 使用率: ${stats?.cpuUsed?.toFixed(2) || '0.00'} / 100 (Screeps の基本制限: 100)`}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.25rem',
                        }}
                    >
                        <span>📊 CPU 使用率: {stats?.cpuUsed?.toFixed(2) || '0.00'}</span>
                        <span style={{ fontSize: '0.85rem' }}>
                            {stats?.cpuUsed !== undefined
                                ? `${Math.min(100, stats.cpuUsed).toFixed(1)}%`
                                : '0.0%'}
                        </span>
                    </div>
                    <div
                        role="progressbar"
                        aria-label="CPU使用率"
                        aria-valuenow={stats?.cpuUsed || 0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuetext={`${stats?.cpuUsed?.toFixed(2) || 0} / 100`}
                        style={{
                            height: '0.5rem',
                            backgroundColor: '#edf2f7',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                backgroundColor:
                                    (stats?.cpuUsed || 0) > 80
                                        ? '#e53e3e'
                                        : (stats?.cpuUsed || 0) > 40
                                          ? '#dd6b20'
                                          : '#319795',
                                width: `${Math.min(100, stats?.cpuUsed || 0)}%`,
                                transition:
                                    'width 0.3s ease-in-out, background-color 0.3s ease-in-out',
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                    {stats?.power !== undefined && (
                        <p
                            className="interactive-hint"
                            title="グローバルパワーレベル (GPL) です"
                            aria-label="グローバルパワーレベル (GPL) です"
                            tabIndex={0}
                            style={{ margin: 0 }}
                        >
                            💪 GPL: {stats.power}
                        </p>
                    )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <span
                        className="interactive-hint"
                        tabIndex={0}
                        role="status"
                        aria-live="polite"
                        title={
                            roomQuery
                                ? `検索に一致した部屋数: ${filteredRooms.length} / 全部屋数: ${stats?.rooms?.length || 0}`
                                : 'AI が現在活動している部屋のリストです'
                        }
                        aria-label={
                            roomQuery
                                ? `検索に一致した部屋数 ${filteredRooms.length}、全部屋数 ${stats?.rooms?.length || 0}`
                                : 'AI が現在活動している部屋のリストです'
                        }
                    >
                        🏘️ {stats?.rooms?.length === 1 ? '部屋' : '部屋数'} (
                        {roomQuery ? `${filteredRooms.length} / ` : ''}
                        {stats?.rooms?.length || 0}):
                    </span>
                    {stats?.rooms?.length > 1 && (
                        <button
                            onClick={copyAllRooms}
                            disabled={filteredRooms.length === 0}
                            onMouseEnter={() => setCopyAllHover(true)}
                            onMouseLeave={() => setCopyAllHover(false)}
                            onFocus={() => setCopyAllHover(true)}
                            onBlur={() => setCopyAllHover(false)}
                            aria-label={
                                filteredRooms.length === 0
                                    ? 'コピー対象の部屋がありません'
                                    : copiedAllRooms
                                      ? roomQuery
                                          ? 'フィルター結果をコピーしました'
                                          : 'すべての部屋名をコピーしました'
                                      : roomQuery
                                        ? 'フィルター結果をコピー'
                                        : 'すべての部屋名をコピー'
                            }
                            title={
                                filteredRooms.length === 0
                                    ? 'コピー対象の部屋がありません'
                                    : copiedAllRooms
                                      ? roomQuery
                                          ? 'フィルター結果をコピーしました'
                                          : 'すべての部屋名をコピーしました'
                                      : roomQuery
                                        ? 'フィルター結果をコピー'
                                        : 'すべての部屋名をコピー'
                            }
                            style={{
                                fontSize: '0.75rem',
                                padding: '0.1rem 0.4rem',
                                backgroundColor: filteredRooms.length === 0
                                    ? '#edf2f7'
                                    : copiedAllRooms
                                      ? '#c6f6d5'
                                      : copyAllHover
                                        ? '#e2e8f0'
                                        : '#edf2f7',
                                border: '1px solid #cbd5e0',
                                borderRadius: '4px',
                                color: filteredRooms.length === 0
                                    ? '#a0aec0'
                                    : copiedAllRooms
                                      ? '#22543d'
                                      : '#4a5568',
                                cursor: filteredRooms.length === 0 ? 'not-allowed' : 'pointer',
                                opacity: filteredRooms.length === 0 ? 0.6 : 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                transition: 'all 0.2s ease-in-out',
                                transform: copyAllHover && filteredRooms.length > 0 ? 'scale(1.05)' : 'scale(1)',
                            }}
                        >
                            {copiedAllRooms
                                ? '✅ コピーしました'
                                : roomQuery
                                  ? '📋 結果をコピー'
                                  : '📋 すべてコピー'}
                        </button>
                    )}
                    {stats?.rooms?.length > 3 && (
                        <div
                            style={{
                                position: 'relative',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                            }}
                        >
                            <kbd
                                aria-label="キーボードショートカット Alt + S キーで部屋の検索入力にフォーカスできます"
                                title="Alt + S キーで検索入力にフォーカスできます"
                                style={{
                                    backgroundColor: '#f7fafc',
                                    border: '1px solid #cbd5e0',
                                    borderRadius: '4px',
                                    padding: '0.1rem 0.4rem',
                                    fontSize: '0.7rem',
                                    color: '#4a5568',
                                    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                                }}
                            >
                                Alt + S
                            </kbd>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={roomQuery}
                                onChange={(e) => setRoomQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        if (roomQuery) {
                                            setRoomQuery('');
                                        } else {
                                            searchInputRef.current?.blur();
                                        }
                                    }
                                }}
                                placeholder="部屋を検索... (Escでクリア)"
                                aria-label="部屋名で検索"
                                style={{
                                    fontSize: '0.75rem',
                                    padding: roomQuery
                                        ? '0.15rem 1.4rem 0.15rem 0.4rem'
                                        : '0.15rem 0.4rem',
                                    border: '1px solid #cbd5e0',
                                    borderRadius: '4px',
                                    outline: 'none',
                                    transition: 'all 0.2s ease-in-out',
                                    width: searchFocused || roomQuery ? '160px' : '100px',
                                }}
                                onFocus={(e) => {
                                    setSearchFocused(true);
                                    e.currentTarget.style.borderColor = '#004b73';
                                    e.currentTarget.style.boxShadow =
                                        '0 0 0 2px rgba(0, 75, 115, 0.2)';
                                }}
                                onBlur={(e) => {
                                    setSearchFocused(false);
                                    e.currentTarget.style.borderColor = '#cbd5e0';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                            {roomQuery && (
                                <button
                                    onClick={() => setRoomQuery('')}
                                    aria-label="検索キーワードをクリア"
                                    title="検索をクリア"
                                    style={{
                                        position: 'absolute',
                                        right: '4px',
                                        background: 'none',
                                        border: 'none',
                                        color: '#718096',
                                        cursor: 'pointer',
                                        padding: '0.1rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.7rem',
                                        lineHeight: 1,
                                        borderRadius: '50%',
                                        width: '14px',
                                        height: '14px',
                                        transition: 'background-color 0.1s, color 0.1s',
                                        outline: 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#cbd5e0';
                                        e.currentTarget.style.color = '#2d3748';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#718096';
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.backgroundColor = '#cbd5e0';
                                        e.currentTarget.style.color = '#2d3748';
                                        e.currentTarget.style.outline = '1px solid #004b73';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#718096';
                                        e.currentTarget.style.outline = 'none';
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    )}
                    {roomQuery && filteredRooms.length === 0 && (
                        <span
                            role="status"
                            aria-live="polite"
                            style={{
                                fontSize: '0.75rem',
                                color: '#e53e3e',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        >
                            一致なし
                            <button
                                onClick={() => {
                                    setRoomQuery('');
                                    searchInputRef.current?.focus();
                                }}
                                aria-label="検索フィルターをクリア"
                                title="検索をクリア"
                                style={{
                                    marginLeft: '0.25rem',
                                    fontSize: '0.75rem',
                                    color: '#004b73',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    padding: '0.1rem 0.2rem',
                                    borderRadius: '2px',
                                }}
                            >
                                クリア
                            </button>
                        </span>
                    )}
                    {filteredRooms.length > 0
                        ? filteredRooms.map((room: string) => (
                              <button
                                  key={room}
                                  onClick={() => copyRoom(room)}
                                  onMouseEnter={() => setHoveredRoom(room)}
                                  onMouseLeave={() => setHoveredRoom(null)}
                                  onFocus={() => setHoveredRoom(room)}
                                  onBlur={() => setHoveredRoom(null)}
                                  aria-label={
                                      copiedRoom === room ? 'コピー済み' : `部屋名 ${room} をコピー`
                                  }
                                  title={
                                      copiedRoom === room ? 'コピー済み' : `部屋名 ${room} をコピー`
                                  }
                                  style={{
                                      fontSize: '0.75rem',
                                      backgroundColor:
                                          copiedRoom === room
                                              ? '#c6f6d5'
                                              : hoveredRoom === room
                                                ? '#e2e8f0'
                                                : '#edf2f7',
                                      padding: '0.1rem 0.4rem',
                                      borderRadius: '4px',
                                      border: '1px solid #cbd5e0',
                                      color: copiedRoom === room ? '#22543d' : '#2d3748',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease-in-out',
                                      transform: hoveredRoom === room ? 'scale(1.06)' : 'scale(1)',
                                      boxShadow:
                                          hoveredRoom === room
                                              ? '0 2px 4px rgba(0,0,0,0.1)'
                                              : 'none',
                                  }}
                              >
                                  {copiedRoom === room ? `✅ ${room}` : room}
                              </button>
                          ))
                        : !roomQuery && (
                              <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>なし</span>
                          )}
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                }}
            >
                <kbd
                    aria-label="キーボードショートカット Alt + D キーで生データの表示・非表示を切り替えられます"
                    title="Alt + D キーで表示・非表示を切り替えられます"
                    style={{
                        backgroundColor: '#f7fafc',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        padding: '0.1rem 0.4rem',
                        fontSize: '0.7rem',
                        color: '#4a5568',
                        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                        marginTop: '0.15rem',
                    }}
                >
                    Alt + D
                </kbd>
                <details
                    open={detailsOpen}
                    onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}
                    style={{ border: 'none' }}
                >
                    <summary
                        className="interactive-hint"
                        title="生データを JSON 形式で表示/非表示にします"
                        aria-label="生データを JSON 形式で表示/非表示にします"
                        style={{
                            color: '#4a5568',
                            padding: '0.2rem 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                        }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                transition: 'transform 0.2s ease-in-out',
                                transform: detailsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                fontSize: '0.75rem',
                            }}
                        >
                            ▶
                        </span>
                        <span>生データを確認</span>
                    </summary>
                    <div
                        style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    copyRawData();
                                }}
                                onMouseEnter={() => setJsonHover(true)}
                                onMouseLeave={() => setJsonHover(false)}
                                onFocus={() => setJsonHover(true)}
                                onBlur={() => setJsonHover(false)}
                                aria-label={
                                    copiedJson ? 'コピー済み' : '生データをJSONとしてコピー'
                                }
                                title={copiedJson ? 'コピー済み' : 'JSONをコピー'}
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.3rem 0.6rem',
                                    backgroundColor: copiedJson
                                        ? '#155d27'
                                        : jsonHover
                                          ? '#e2e8f0'
                                          : '#edf2f7',
                                    border: '1px solid #cbd5e0',
                                    borderRadius: '4px',
                                    color: copiedJson ? 'white' : '#4a5568',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out',
                                    transform: jsonHover ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: jsonHover ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                }}
                            >
                                {copiedJson ? '✅ コピー済み' : '📋 JSONをコピー'}
                            </button>
                        </div>
                        <pre
                            tabIndex={0}
                            aria-label="生データJSON詳細"
                            style={{
                                backgroundColor: '#f7fafc',
                                padding: '1rem',
                                borderRadius: '4px',
                                margin: 0,
                                overflow: 'auto',
                            }}
                        >
                            {JSON.stringify(stats, null, 2)}
                        </pre>
                    </div>
                </details>
            </div>
            {toastMsg && (
                <div
                    key={toastMsg}
                    role="status"
                    aria-live="polite"
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        backgroundColor: '#004b73',
                        color: 'white',
                        padding: '0.75rem 1.5rem 1rem 1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        animation: 'bounce 0.5s ease-in-out',
                        overflow: 'hidden',
                    }}
                >
                    <span>✨</span>
                    <span style={{ flex: 1 }}>{toastMsg}</span>
                    <button
                        onClick={() => {
                            setToastMsg(null);
                            if (toastTimeoutRef.current) {
                                clearTimeout(toastTimeoutRef.current);
                                toastTimeoutRef.current = null;
                            }
                        }}
                        onFocus={() => setToastCloseFocused(true)}
                        onBlur={() => setToastCloseFocused(false)}
                        onMouseEnter={() => setToastCloseFocused(true)}
                        onMouseLeave={() => setToastCloseFocused(false)}
                        aria-label="通知を閉じる"
                        title="閉じる"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            opacity: toastCloseFocused ? 1 : 0.7,
                            transition: 'all 0.1s ease-in-out',
                            outline: 'none',
                            boxShadow: toastCloseFocused ? '0 0 0 2px white' : 'none',
                            borderRadius: '4px',
                        }}
                    >
                        ✕
                    </button>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            height: '3px',
                            backgroundColor: '#319795',
                            animation: 'shrinkWidth 2.5s linear forwards',
                        }}
                    />
                </div>
            )}
        </main>
    );
}
