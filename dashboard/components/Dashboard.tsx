'use client';

import { useEffect, useState, useCallback } from 'react';

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
    // フォーカス状態を管理するステートを追加
    const [isRoomsFocused, setIsRoomsFocused] = useState(false);
    const [isSyncFocused, setIsSyncFocused] = useState(false);
    const [isBarFocused, setIsBarFocused] = useState(false);
    const [isRefreshFocused, setIsRefreshFocused] = useState(false);
    const [isRetryFocused, setIsRetryFocused] = useState(false);
    const [isResetFocused, setIsResetFocused] = useState(false);
    // 追加のフォーカス状態管理
    const [isGclFocused, setIsGclFocused] = useState(false);
    const [isPowerFocused, setIsPowerFocused] = useState(false);
    const [isCpuFocused, setIsCpuFocused] = useState(false);
    const [isCopyFocused, setIsCopyFocused] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [isResetConfirming, setIsResetConfirming] = useState(false);
    const [timeAgo, setTimeAgo] = useState<string>('just now');

    const roomCount = stats?.rooms ? Object.keys(stats.rooms).length : 0;

    const getStalenessInfo = useCallback(() => {
        if (updated) return { icon: '✅', color: '#1e7e34', label: 'Just updated' };
        if (!lastUpdated) return { icon: '🕒', color: '#575757', label: 'Not synced' };
        const diff = (new Date().getTime() - lastUpdated.getTime()) / 60000;
        if (diff > 15) return { icon: '🚨', color: '#d32f2f', label: 'Critical staleness' };
        if (diff > 5) return { icon: '⚠️', color: '#a5532d', label: 'Stale' };
        return { icon: '🕒', color: '#575757', label: 'Fresh' };
    }, [updated, lastUpdated]);

    const handleCopy = useCallback(async () => {
        if (!stats) return;
        try {
            await navigator.clipboard.writeText(JSON.stringify(stats, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [stats]);

    const handleResetSecret = useCallback(() => {
        // 🔑 Security: セッションから秘密鍵を削除し、状態をリセットする
        if (!isResetConfirming) {
            setIsResetConfirming(true);
            setTimeout(() => setIsResetConfirming(false), 3000);
            return;
        }
        sessionStorage.removeItem('dashboard_token');
        setStats(null);
        setError('Secret reset. Please refresh to enter a new secret.');
        setResetSuccess(true);
        setIsResetConfirming(false);
        setTimeout(() => setResetSuccess(false), 2000);
    }, [isResetConfirming]);

    const fetchStats = useCallback(async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        else setLoading(true);

        try {
            // Security: sessionStorageからトークンを取得し、認証ヘッダーに含める
            let token = sessionStorage.getItem('dashboard_token');
            if (!token) {
                token = window.prompt('Enter Dashboard Secret:');
                if (token) {
                    sessionStorage.setItem('dashboard_token', token);
                } else {
                    // 🔑 Security: プロンプトがキャンセルされた場合は、APIリクエストを中断する
                    throw new Error('Authentication required: Secret not provided');
                }
            }

            const r = await fetch('/api/screeps?endpoint=overview', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (r.status === 401) {
                sessionStorage.removeItem('dashboard_token');
                throw new Error('Unauthorized: Invalid dashboard secret');
            }

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
        if (!lastUpdated) return;

        // 相対時間を更新する関数
        const updateRelativeTime = () => {
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

            if (diffInSeconds < 10) {
                setTimeAgo('just now');
            } else if (diffInSeconds < 60) {
                setTimeAgo(`${diffInSeconds}s ago`);
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                setTimeAgo(`${minutes}m ago`);
            } else {
                const hours = Math.floor(diffInSeconds / 3600);
                setTimeAgo(`${hours}h ago`);
            }
        };

        updateRelativeTime();
        // 10秒ごとに相対時間を更新
        const interval = setInterval(updateRelativeTime, 10000);
        return () => clearInterval(interval);
    }, [lastUpdated]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const isR = key === 'r';
            const isC = key === 'c';
            const isL = key === 'l';
            const hasModifier = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;

            if ((isR || isC || isL) && !hasModifier && !loading && !isRefreshing) {
                const activeElement = document.activeElement;
                const isEditable =
                    activeElement instanceof HTMLInputElement ||
                    activeElement instanceof HTMLTextAreaElement ||
                    activeElement instanceof HTMLSelectElement ||
                    activeElement?.getAttribute('contenteditable') === 'true';

                if (!isEditable) {
                    e.preventDefault();
                    if (isR) fetchStats(true);
                    if (isC) handleCopy();
                    if (isL) handleResetSecret();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [fetchStats, handleCopy, loading, isRefreshing, stats]);

    useEffect(() => {
        let title = 'Screeps Dashboard';
        if (loading) title = '⏳ Loading...';
        else if (isRefreshing) title = '🔄 Refreshing...';
        else if (updated) title = '✅ Updated';
        else if (stats?.gcl) {
            const percent = Math.min(
                100,
                Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100)
            );
            title = `Screeps (${percent}%)`;
        }

        if (!loading && !isRefreshing && timeAgo !== 'just now') {
            title += ` - ${timeAgo}`;
        }

        document.title = title;
    }, [loading, isRefreshing, updated, stats, timeAgo]);

    return (
        <main
            style={{
                fontFamily: 'monospace',
                padding: 'clamp(1rem, 5vw, 2rem)',
                maxWidth: '800px',
                margin: '0 auto',
            }}
        >
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                }}
            >
                <h1 style={{ margin: 0 }}>
                    <span role="img" aria-label="Screeps" title="Screeps">
                        🐛
                    </span>{' '}
                    Screeps Dashboard
                </h1>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end',
                    }}
                >
                    {stats?.rooms && (
                        <span
                            style={{
                                fontSize: '0.9rem',
                                color: '#575757',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                cursor: 'help',
                                borderBottom: '1px dotted #888',
                                borderRadius: '2px',
                                padding: '0 2px',
                                // キーボードナビゲーション用のフォーカスリングを追加
                                boxShadow: isRoomsFocused ? '0 0 0 2px #0077aa' : 'none',
                                outline: 'none',
                                transition: 'box-shadow 0.2s',
                            }}
                            aria-label={`Rooms: ${roomCount}. Locations: ${Array.isArray(stats.rooms) ? stats.rooms.join(', ') : Object.keys(stats.rooms).join(', ')}`}
                            title={`Rooms: ${Array.isArray(stats.rooms) ? stats.rooms.join(', ') : Object.keys(stats.rooms).join(', ')}`}
                            tabIndex={0}
                            onFocus={() => setIsRoomsFocused(true)}
                            onBlur={() => setIsRoomsFocused(false)}
                        >
                            <span role="img" aria-label={roomCount === 1 ? 'Room' : 'Rooms'}>
                                {roomCount === 1 ? '🏠' : '🏘️'}
                            </span>{' '}
                            {roomCount} Room{roomCount === 1 ? '' : 's'}
                        </span>
                    )}
                    {lastUpdated && (
                        <span
                            style={{
                                fontSize: '0.8rem',
                                color: getStalenessInfo().color,
                                cursor: 'help',
                                borderBottom: '1px dotted #888',
                                borderRadius: '2px',
                                padding: '0 2px',
                                // キーボードナビゲーション用のフォーカスリングを追加
                                boxShadow: isSyncFocused ? '0 0 0 2px #0077aa' : 'none',
                                outline: 'none',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                            }}
                            aria-label={`Last sync: ${timeAgo} (${getStalenessInfo().label}). Exact time: ${lastUpdated.toLocaleString()}`}
                            title={lastUpdated.toLocaleString()}
                            tabIndex={0}
                            onFocus={() => setIsSyncFocused(true)}
                            onBlur={() => setIsSyncFocused(false)}
                        >
                            <span role="img" aria-label={getStalenessInfo().label}>
                                {getStalenessInfo().icon}
                            </span>
                            Last sync: <time dateTime={lastUpdated?.toISOString()}>{timeAgo}</time>
                        </span>
                    )}
                    <button
                        onClick={handleResetSecret}
                        onFocus={() => setIsResetFocused(true)}
                        onBlur={() => {
                            setIsResetFocused(false);
                            setIsResetConfirming(false);
                        }}
                        onMouseLeave={() => setIsResetConfirming(false)}
                        disabled={loading || isRefreshing}
                        aria-label={
                            resetSuccess
                                ? 'Secret reset'
                                : isResetConfirming
                                  ? 'Confirm reset?'
                                  : 'Reset Secret'
                        }
                        aria-keyshortcuts="l"
                        title={
                            resetSuccess
                                ? 'Secret Reset!'
                                : isResetConfirming
                                  ? 'Click again to confirm reset (L)'
                                  : 'Reset Secret (L)'
                        }
                        style={{
                            cursor: loading || isRefreshing ? 'not-allowed' : 'pointer',
                            padding: '0.5rem',
                            background: resetSuccess
                                ? '#1e7e34'
                                : isResetConfirming
                                  ? '#a5532d'
                                  : '#575757',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            opacity: loading || isRefreshing ? 0.6 : 1,
                            transition: 'all 0.2s',
                            userSelect: 'none',
                            boxShadow: isResetFocused
                                ? `0 0 0 2px #ffffff, 0 0 0 4px ${
                                      resetSuccess
                                          ? '#1e7e34'
                                          : isResetConfirming
                                            ? '#a5532d'
                                            : '#575757'
                                  }`
                                : 'none',
                            outline: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <span
                            role="img"
                            aria-label={
                                resetSuccess ? 'Success' : isResetConfirming ? 'Question' : 'Key'
                            }
                            style={{ fontSize: '1.1rem' }}
                        >
                            {resetSuccess ? '✅' : isResetConfirming ? '❓' : '🔑'}
                        </span>
                    </button>
                    <button
                        onClick={() => fetchStats(true)}
                        onFocus={() => setIsRefreshFocused(true)}
                        onBlur={() => setIsRefreshFocused(false)}
                        disabled={loading || isRefreshing}
                        aria-label={
                            updated
                                ? 'Stats updated'
                                : isRefreshing
                                  ? 'Refreshing stats'
                                  : 'Refresh stats'
                        }
                        aria-keyshortcuts="r"
                        title={isRefreshing ? 'Refreshing...' : 'Refresh stats (R)'}
                        style={{
                            cursor: loading || isRefreshing ? 'not-allowed' : 'pointer',
                            padding: '0.5rem 1rem',
                            // コントラスト比向上のため濃い緑に変更 (#28a745 -> #1e7e34)
                            background: updated ? '#1e7e34' : '#0077aa',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            opacity: loading || isRefreshing ? 0.6 : 1,
                            transition: 'all 0.2s',
                            userSelect: 'none',
                            boxShadow: isRefreshFocused
                                ? '0 0 0 2px #ffffff, 0 0 0 4px #0077aa'
                                : 'none',
                            outline: 'none',
                        }}
                    >
                        {updated ? '✅ Updated!' : isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
                    </button>
                </div>
            </header>

            <div
                aria-live="polite"
                style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }}
            >
                {isRefreshing ? 'Refreshing statistics...' : ''}
                {updated ? 'Dashboard updated' : ''}
                {copied ? 'JSON copied to clipboard' : ''}
            </div>

            <div aria-live="polite">
                {loading && (
                    <>
                        <section
                            aria-busy="true"
                            aria-label="Loading GCL stats"
                            style={{
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                border: '1px solid #eee',
                                borderRadius: '4px',
                                opacity: 0.6,
                                boxShadow:
                                    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                            }}
                        >
                            <span
                                style={{
                                    position: 'absolute',
                                    width: '1px',
                                    height: '1px',
                                    padding: 0,
                                    margin: '-1px',
                                    overflow: 'hidden',
                                    clip: 'rect(0, 0, 0, 0)',
                                    whiteSpace: 'nowrap',
                                    border: 0,
                                }}
                            >
                                Loading GCL stats...
                            </span>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '120px',
                                            height: '1.2rem',
                                            background: '#eeeeee',
                                            borderRadius: '4px',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '0.9rem',
                                            background: '#eeeeee',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '1.2rem',
                                        background: '#eeeeee',
                                        borderRadius: '4px',
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    height: '12px',
                                    background: '#eeeeee',
                                    borderRadius: '6px',
                                    marginBottom: '0.5rem',
                                }}
                            />
                            <div
                                style={{
                                    width: '150px',
                                    height: '0.75rem',
                                    background: '#eeeeee',
                                    borderRadius: '4px',
                                    marginLeft: 'auto',
                                }}
                            />
                        </section>
                        <section
                            aria-busy="true"
                            aria-label="Loading raw data"
                            style={{
                                padding: '1rem',
                                border: '1px solid #eee',
                                borderRadius: '4px',
                                opacity: 0.6,
                                boxShadow:
                                    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    background: '#eeeeee',
                                    borderRadius: '4px',
                                }}
                            />
                        </section>
                    </>
                )}
            </div>

            {error && (
                <div
                    role="alert"
                    style={{
                        color: '#d32f2f',
                        padding: '1rem',
                        border: '1px solid #d32f2f',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff5f5',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span role="img" aria-label="Error">
                            ⚠️
                        </span>{' '}
                        {error}
                    </div>
                    <button
                        onClick={() => fetchStats(true)}
                        onFocus={() => setIsRetryFocused(true)}
                        onBlur={() => setIsRetryFocused(false)}
                        disabled={loading || isRefreshing}
                        aria-label="Retry fetching stats"
                        aria-keyshortcuts="r"
                        title="Retry (R)"
                        style={{
                            padding: '0.25rem 0.75rem',
                            background: '#d32f2f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading || isRefreshing ? 'not-allowed' : 'pointer',
                            fontSize: '0.8rem',
                            opacity: loading || isRefreshing ? 0.6 : 1,
                            transition: 'all 0.2s',
                            userSelect: 'none',
                            boxShadow: isRetryFocused
                                ? '0 0 0 2px #ffffff, 0 0 0 4px #d32f2f'
                                : 'none',
                            outline: 'none',
                        }}
                    >
                        {isRefreshing ? 'Retrying...' : 'Retry'}
                    </button>
                </div>
            )}

            {stats?.gcl && (
                <section
                    style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        border: updated ? '1px solid #1e7e34' : '1px solid #eee',
                        borderRadius: '4px',
                        boxShadow: updated
                            ? '0 0 0 2px #1e7e34'
                            : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                        opacity: loading || isRefreshing ? 0.6 : 1,
                        transition: 'all 0.2s ease-in-out',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <strong
                                tabIndex={0}
                                onFocus={() => setIsGclFocused(true)}
                                onBlur={() => setIsGclFocused(false)}
                                title="Global Control Level"
                                style={{
                                    cursor: 'help',
                                    borderBottom: '1px dotted #888',
                                    borderRadius: '2px',
                                    padding: '0 2px',
                                    outline: 'none',
                                    boxShadow: isGclFocused ? '0 0 0 2px #0077aa' : 'none',
                                    transition: 'box-shadow 0.2s',
                                }}
                            >
                                <span role="img" aria-label="Global Control Level">
                                    🌐
                                </span>{' '}
                                GCL: {stats.gcl.level}
                            </strong>
                            {stats.power !== undefined && (
                                <span
                                    tabIndex={0}
                                    onFocus={() => setIsPowerFocused(true)}
                                    onBlur={() => setIsPowerFocused(false)}
                                    title="Power"
                                    style={{
                                        fontSize: '0.9rem',
                                        color: '#575757',
                                        cursor: 'help',
                                        borderBottom: '1px dotted #888',
                                        borderRadius: '2px',
                                        padding: '0 2px',
                                        outline: 'none',
                                        boxShadow: isPowerFocused ? '0 0 0 2px #0077aa' : 'none',
                                        transition: 'box-shadow 0.2s',
                                    }}
                                >
                                    <span role="img" aria-label="Power">
                                        ⚡
                                    </span>{' '}
                                    Power: {stats.power.toLocaleString()}
                                </span>
                            )}
                            {stats.cpuUsed !== undefined && (
                                <span
                                    tabIndex={0}
                                    onFocus={() => setIsCpuFocused(true)}
                                    onBlur={() => setIsCpuFocused(false)}
                                    title="CPU Used"
                                    style={{
                                        fontSize: '0.9rem',
                                        color: '#575757',
                                        cursor: 'help',
                                        borderBottom: '1px dotted #888',
                                        borderRadius: '2px',
                                        padding: '0 2px',
                                        outline: 'none',
                                        boxShadow: isCpuFocused ? '0 0 0 2px #0077aa' : 'none',
                                        transition: 'box-shadow 0.2s',
                                    }}
                                >
                                    <span role="img" aria-label="CPU Used">
                                        📊
                                    </span>{' '}
                                    CPU: {stats.cpuUsed.toLocaleString()}
                                </span>
                            )}
                        </div>
                        <span
                            id="gcl-percent"
                            style={{
                                fontWeight: 'bold',
                                color:
                                    stats.gcl.progress >= stats.gcl.progressTotal
                                        ? '#FFD700'
                                        : '#0077aa',
                                backgroundColor:
                                    stats.gcl.progress >= stats.gcl.progressTotal
                                        ? '#333'
                                        : 'transparent',
                                padding:
                                    stats.gcl.progress >= stats.gcl.progressTotal ? '2px 6px' : '0',
                                borderRadius: '4px',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {Math.min(
                                100,
                                Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100)
                            )}
                            %
                        </span>
                    </div>
                    <div
                        role="progressbar"
                        tabIndex={0}
                        aria-label="Global Control Level progress"
                        aria-describedby="gcl-percent"
                        aria-valuenow={Math.min(
                            100,
                            Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100)
                        )}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuetext={`${Math.min(100, Math.floor((stats.gcl.progress / stats.gcl.progressTotal) * 100))}% complete, ${(stats.gcl.progressTotal - stats.gcl.progress).toLocaleString()} XP remaining to level ${stats.gcl.level + 1}`}
                        title={`${(stats.gcl.progressTotal - stats.gcl.progress).toLocaleString()} XP remaining to level ${stats.gcl.level + 1}`}
                        onFocus={() => setIsBarFocused(true)}
                        onBlur={() => setIsBarFocused(false)}
                        style={{
                            width: '100%',
                            height: '12px',
                            background:
                                stats.gcl.progress >= stats.gcl.progressTotal
                                    ? '#333333'
                                    : '#eeeeee',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            marginBottom: '0.5rem',
                            cursor: 'help',
                            // キーボードナビゲーション用のフォーカスリングを追加
                            boxShadow: isBarFocused ? '0 0 0 2px #0077aa' : 'none',
                            outline: 'none',
                            transition: 'box-shadow 0.2s',
                        }}
                    >
                        <div
                            style={{
                                width: `${(stats.gcl.progress / stats.gcl.progressTotal) * 100}%`,
                                height: '100%',
                                background:
                                    stats.gcl.progress >= stats.gcl.progressTotal
                                        ? '#FFD700'
                                        : '#0077aa',
                                transition: 'width 0.5s ease-in-out',
                            }}
                        />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#575757', textAlign: 'right' }}>
                        {stats.gcl.progress.toLocaleString()} /{' '}
                        {stats.gcl.progressTotal.toLocaleString()}
                    </div>
                </section>
            )}

            <section
                style={{
                    opacity: loading || isRefreshing ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                }}
            >
                {stats && Object.keys(stats).length > 0 ? (
                    <div
                        style={{
                            position: 'relative',
                            // コントラスト比向上のため濃い緑に変更 (#28a745 -> #1e7e34)
                            border: updated ? '1px solid #1e7e34' : 'none',
                            boxShadow: isJsonFocused
                                ? '0 0 0 2px #0077aa'
                                : updated || copied
                                  ? '0 0 0 2px #1e7e34'
                                  : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                            transition: 'all 0.2s ease-in-out',
                            borderRadius: '4px',
                        }}
                    >
                        <button
                            onClick={handleCopy}
                            onFocus={() => setIsCopyFocused(true)}
                            onBlur={() => setIsCopyFocused(false)}
                            aria-label={copied ? 'Stats copied' : 'Copy stats as JSON'}
                            aria-keyshortcuts="c"
                            title={copied ? 'Copied!' : 'Copy to clipboard (C)'}
                            style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem',
                                // コントラスト比向上のため濃い緑に変更 (#28a745 -> #1e7e34)
                                background: copied ? '#1e7e34' : '#575757',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                userSelect: 'none',
                                zIndex: 1,
                                outline: 'none',
                                boxShadow: isCopyFocused
                                    ? '0 0 0 2px #ffffff, 0 0 0 4px #0077aa'
                                    : 'none',
                            }}
                        >
                            {copied ? '✅ Copied!' : '📋 Copy JSON'}
                        </button>
                        <pre
                            aria-label="Screeps statistics JSON. Press 'C' to copy."
                            title="Screeps statistics JSON (C to copy)"
                            tabIndex={0}
                            onFocus={() => setIsJsonFocused(true)}
                            onBlur={() => setIsJsonFocused(false)}
                            style={{
                                background: '#f8f8f8',
                                padding: '1rem',
                                borderRadius: '4px',
                                overflow: 'auto',
                                maxHeight: '500px',
                                margin: 0,
                                border: '1px solid #eee',
                                outline: 'none',
                            }}
                        >
                            {JSON.stringify(stats, null, 2)}
                        </pre>
                    </div>
                ) : (
                    !loading && (
                        <div
                            style={{
                                textAlign: 'center',
                                color: '#575757',
                                padding: '3rem 1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            <p style={{ margin: 0 }}>
                                <span role="img" aria-label="Ghost">
                                    👻
                                </span>{' '}
                                No data available.
                            </p>
                            <button
                                onClick={() => fetchStats(true)}
                                disabled={loading || isRefreshing}
                                aria-label={
                                    updated
                                        ? 'Stats updated'
                                        : isRefreshing
                                          ? 'Refreshing stats'
                                          : 'Refresh stats'
                                }
                                aria-keyshortcuts="r"
                                title="Refresh stats (R)"
                                style={{
                                    cursor: loading || isRefreshing ? 'not-allowed' : 'pointer',
                                    padding: '0.5rem 1rem',
                                    // コントラスト比向上のため濃い緑に変更 (#28a745 -> #1e7e34)
                                    background: updated ? '#1e7e34' : '#0077aa',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    opacity: loading || isRefreshing ? 0.6 : 1,
                                    transition: 'all 0.2s',
                                }}
                            >
                                {updated ? '✅ Updated!' : '🔄 Refresh Dashboard'}
                            </button>
                        </div>
                    )
                )}
            </section>

            <footer
                style={{
                    marginTop: '3rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #eee',
                    fontSize: '0.8rem',
                    color: '#666',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}
            >
                <div>
                    Keyboard Shortcuts:{' '}
                    <kbd
                        style={{
                            background: '#eee',
                            padding: '0.1rem 0.3rem',
                            borderRadius: '3px',
                            border: '1px solid #ccc',
                            boxShadow: '0 1px 1px rgba(0,0,0,0.2), 0 2px 0 0 rgba(255,255,255,0.7) inset',
                            display: 'inline-block',
                            minWidth: '1.2em',
                            textAlign: 'center',
                        }}
                    >
                        R
                    </kbd>{' '}
                    Refresh ·{' '}
                    <kbd
                        style={{
                            background: '#eee',
                            padding: '0.1rem 0.3rem',
                            borderRadius: '3px',
                            border: '1px solid #ccc',
                            boxShadow: '0 1px 1px rgba(0,0,0,0.2), 0 2px 0 0 rgba(255,255,255,0.7) inset',
                            display: 'inline-block',
                            minWidth: '1.2em',
                            textAlign: 'center',
                        }}
                    >
                        C
                    </kbd>{' '}
                    Copy JSON ·{' '}
                    <kbd
                        style={{
                            background: '#eee',
                            padding: '0.1rem 0.3rem',
                            borderRadius: '3px',
                            border: '1px solid #ccc',
                            boxShadow: '0 1px 1px rgba(0,0,0,0.2), 0 2px 0 0 rgba(255,255,255,0.7) inset',
                            display: 'inline-block',
                            minWidth: '1.2em',
                            textAlign: 'center',
                        }}
                    >
                        L
                    </kbd>{' '}
                    Reset Secret
                </div>
                <div>
                    Hover/Focus items with{' '}
                    <span style={{ cursor: 'help', borderBottom: '1px dotted #888' }}>
                        dotted underline
                    </span>{' '}
                    for details.
                </div>
            </footer>
        </main>
    );
}
