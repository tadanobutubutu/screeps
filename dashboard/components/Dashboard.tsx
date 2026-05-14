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
    const [prevStats, setPrevStats] = useState<ScreepsStats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [prevLastUpdated, setPrevLastUpdated] = useState<Date | null>(null);
    const [copied, setCopied] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [isRefreshFocused, setIsRefreshFocused] = useState(false);
    const [isRetryFocused, setIsRetryFocused] = useState(false);
    const [isResetFocused, setIsResetFocused] = useState(false);
    const [isCopyFocused, setIsCopyFocused] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [isResetConfirming, setIsResetConfirming] = useState(false);
    const [timeAgo, setTimeAgo] = useState<string>('just now');

    const roomCount = stats?.rooms ? Object.keys(stats.rooms).length : 0;
    const prevRoomCount = prevStats?.rooms ? Object.keys(prevStats.rooms).length : 0;
    const roomDelta = prevStats ? roomCount - prevRoomCount : 0;

    const gclPercent = stats?.gcl
        ? Math.min(100, (stats.gcl.progress / stats.gcl.progressTotal) * 100)
        : 0;
    const prevGclPercent = prevStats?.gcl
        ? Math.min(100, (prevStats.gcl.progress / prevStats.gcl.progressTotal) * 100)
        : 0;
    const leveledUp = stats?.gcl && prevStats?.gcl && stats.gcl.level > prevStats.gcl.level;
    const gclDelta = leveledUp
        ? 100 - prevGclPercent + gclPercent
        : stats?.gcl && prevStats?.gcl
          ? gclPercent - prevGclPercent
          : 0;
    const powerDelta =
        stats?.power !== undefined && prevStats?.power !== undefined
            ? stats.power - prevStats.power
            : 0;
    const cpuDelta =
        stats?.cpuUsed !== undefined && prevStats?.cpuUsed !== undefined
            ? stats.cpuUsed - prevStats.cpuUsed
            : 0;

    const getTimeToLevel = useCallback(() => {
        if (!stats?.gcl || !prevStats?.gcl || !lastUpdated || !prevLastUpdated) return null;
        if (stats.gcl.level !== prevStats.gcl.level) return null;

        const xpGain = stats.gcl.progress - prevStats.gcl.progress;
        const timeDiff = lastUpdated.getTime() - prevLastUpdated.getTime();

        if (xpGain <= 0 || timeDiff <= 0) return null;

        const xpRemaining = stats.gcl.progressTotal - stats.gcl.progress;
        const xpPerMs = xpGain / timeDiff;
        return xpRemaining / xpPerMs;
    }, [stats, prevStats, lastUpdated, prevLastUpdated]);

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    };

    const getStalenessInfo = useCallback(() => {
        if (updated) return { icon: '✅', color: '#1e7e34', label: 'Just updated' };
        if (!lastUpdated) return { icon: '🕒', color: '#575757', label: 'Not synced' };
        const diff = (new Date().getTime() - lastUpdated.getTime()) / 60000;
        if (diff > 15) return { icon: '🚨', color: '#d32f2f', label: 'Critical staleness' };
        if (diff > 5) return { icon: '⚠️', color: '#a5532d', label: 'Stale' };
        return { icon: '🟢', color: '#1e7e34', label: 'Fresh' };
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

    const fetchStats = useCallback(
        async (isManual = false) => {
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
                setPrevStats(stats);
                setPrevLastUpdated(lastUpdated);
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
        },
        [stats, lastUpdated]
    );

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        let emoji = '🐛';
        const staleness = getStalenessInfo();

        if (loading) {
            title = '⏳ Loading...';
            emoji = '⏳';
        } else if (isRefreshing) {
            title = '🔄 Refreshing...';
            emoji = '🔄';
        } else if (error) {
            title = '⚠️ Error';
            emoji = '⚠️';
        } else if (updated) {
            title = '✅ Updated';
            emoji = '✅';
        } else if (staleness.icon === '🚨' || staleness.icon === '⚠️') {
            title = `${staleness.icon} ${staleness.label}`;
            emoji = staleness.icon;
        } else if (stats?.gcl) {
            const percent = Math.min(
                100,
                (stats.gcl.progress / stats.gcl.progressTotal) * 100
            ).toFixed(2);
            title = `Screeps (${percent}%)`;
        }

        if (!loading && !isRefreshing && timeAgo !== 'just now') {
            title += ` - ${timeAgo}`;
        }

        document.title = title;

        // 🎨 Palette: Update favicon emoji dynamically to reflect application state
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
            link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`;
        }
    }, [loading, isRefreshing, updated, stats, timeAgo, error, getStalenessInfo]);

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
                    <span
                        role="img"
                        aria-label="Screeps"
                        title="Screeps"
                        style={{
                            display: 'inline-block',
                            animation: isRefreshing
                                ? 'spin 1s linear infinite'
                                : updated
                                  ? 'bounce 0.6s ease'
                                  : 'none',
                        }}
                    >
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
                            className="interactive-hint"
                            style={{
                                fontSize: '0.9rem',
                                color: '#575757',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                            }}
                            aria-label={`Rooms: ${roomCount}. Locations: ${Array.isArray(stats.rooms) ? stats.rooms.join(', ') : Object.keys(stats.rooms).join(', ')}`}
                            title={`Rooms: ${Array.isArray(stats.rooms) ? stats.rooms.join(', ') : Object.keys(stats.rooms).join(', ')}`}
                            tabIndex={0}
                        >
                            <span role="img" aria-label={roomCount === 1 ? 'Room' : 'Rooms'}>
                                {roomCount === 1 ? '🏠' : '🏘️'}
                            </span>{' '}
                            {roomCount} Room{roomCount === 1 ? '' : 's'}
                            {roomDelta !== 0 && (
                                <span
                                    style={{
                                        fontSize: '0.8rem',
                                        color: roomDelta > 0 ? '#1e7e34' : '#d32f2f',
                                        marginLeft: '0.25rem',
                                        fontWeight: 'bold',
                                    }}
                                    aria-label={
                                        roomDelta > 0
                                            ? `Gained ${roomDelta} room`
                                            : `Lost ${Math.abs(roomDelta)} room`
                                    }
                                    title={
                                        roomDelta > 0
                                            ? `Gained ${roomDelta} room`
                                            : `Lost ${Math.abs(roomDelta)} room`
                                    }
                                >
                                    ({roomDelta > 0 ? '+' : ''}
                                    {roomDelta})
                                </span>
                            )}
                        </span>
                    )}
                    {lastUpdated && (
                        <span
                            className="interactive-hint"
                            style={{
                                fontSize: '0.8rem',
                                color: getStalenessInfo().color,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                            }}
                            aria-label={`Last sync: ${timeAgo} (${getStalenessInfo().label}). Exact time: ${lastUpdated.toLocaleString()}`}
                            title={lastUpdated.toLocaleString()}
                            tabIndex={0}
                        >
                            <span
                                role="img"
                                aria-label={getStalenessInfo().label}
                                style={{
                                    animation:
                                        getStalenessInfo().icon === '🚨'
                                            ? 'shake 0.3s infinite'
                                            : 'none',
                                }}
                            >
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
                            background: updated ? '#1e7e34' : '#006699',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            opacity: loading || isRefreshing ? 0.6 : 1,
                            transition: 'all 0.2s',
                            userSelect: 'none',
                            boxShadow: isRefreshFocused
                                ? '0 0 0 2px #ffffff, 0 0 0 4px #006699'
                                : 'none',
                            outline: 'none',
                        }}
                    >
                        {updated ? (
                            '✅ Updated!'
                        ) : isRefreshing ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        animation: 'spin 1s linear infinite',
                                    }}
                                >
                                    🔄
                                </span>{' '}
                                Refreshing...
                            </span>
                        ) : (
                            '🔄 Refresh'
                        )}
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
                                animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
                                animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
                    aria-live="assertive"
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
                        {isRefreshing ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        animation: 'spin 1s linear infinite',
                                    }}
                                >
                                    🔄
                                </span>{' '}
                                Retrying...
                            </span>
                        ) : (
                            'Retry'
                        )}
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
                                className="interactive-hint"
                                tabIndex={0}
                                title="Global Control Level"
                            >
                                <span role="img" aria-label="Global Control Level">
                                    🌐
                                </span>{' '}
                                GCL: {stats.gcl.level}
                            </strong>
                            {leveledUp && (
                                <span
                                    style={{
                                        color: '#FFD700',
                                        fontWeight: 'bold',
                                        marginLeft: '0.5rem',
                                        animation: 'bounce 0.6s ease',
                                        display: 'inline-block',
                                        backgroundColor: '#333333',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    LEVEL UP! 🎉
                                </span>
                            )}
                            {stats.power !== undefined && (
                                <span
                                    className="interactive-hint"
                                    tabIndex={0}
                                    title="Power"
                                    style={{
                                        fontSize: '0.9rem',
                                        color: '#575757',
                                    }}
                                >
                                    <span role="img" aria-label="Power">
                                        ⚡
                                    </span>{' '}
                                    Power: {stats.power.toLocaleString()}
                                    {powerDelta > 0 && (
                                        <span
                                            style={{
                                                fontSize: '0.8rem',
                                                color: '#1e7e34',
                                                marginLeft: '0.25rem',
                                                fontWeight: 'bold',
                                            }}
                                            aria-label={`Increased by ${powerDelta.toLocaleString()}`}
                                            title={`Increased by ${powerDelta.toLocaleString()}`}
                                        >
                                            (+{powerDelta.toLocaleString()})
                                        </span>
                                    )}
                                </span>
                            )}
                            {stats.cpuUsed !== undefined && (
                                <span
                                    className="interactive-hint"
                                    tabIndex={0}
                                    title="CPU Used"
                                    style={{
                                        fontSize: '0.9rem',
                                        color: '#575757',
                                    }}
                                >
                                    <span role="img" aria-label="CPU Used">
                                        📊
                                    </span>{' '}
                                    CPU: {stats.cpuUsed.toLocaleString()}
                                    {cpuDelta !== 0 && (
                                        <span
                                            style={{
                                                fontSize: '0.8rem',
                                                color: cpuDelta > 0 ? '#d32f2f' : '#1e7e34',
                                                marginLeft: '0.25rem',
                                                fontWeight: 'bold',
                                            }}
                                            aria-label={
                                                cpuDelta > 0
                                                    ? `Increased by ${cpuDelta.toLocaleString()}`
                                                    : `Decreased by ${Math.abs(cpuDelta).toLocaleString()}`
                                            }
                                            title={
                                                cpuDelta > 0
                                                    ? `Increased by ${cpuDelta.toLocaleString()}`
                                                    : `Decreased by ${Math.abs(cpuDelta).toLocaleString()}`
                                            }
                                        >
                                            ({cpuDelta > 0 ? '+' : ''}
                                            {cpuDelta.toLocaleString()})
                                        </span>
                                    )}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span
                                id="gcl-percent"
                                style={{
                                    fontWeight: 'bold',
                                    color:
                                        stats.gcl.progress >= stats.gcl.progressTotal
                                            ? '#FFD700'
                                            : '#006699',
                                    backgroundColor:
                                        stats.gcl.progress >= stats.gcl.progressTotal
                                            ? '#333'
                                            : 'transparent',
                                    padding:
                                        stats.gcl.progress >= stats.gcl.progressTotal
                                            ? '2px 6px'
                                            : '0',
                                    borderRadius: '4px',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {gclPercent.toFixed(2)}%
                            </span>
                            {gclDelta > 0 && (
                                <span
                                    style={{
                                        fontSize: '0.8rem',
                                        color: '#1e7e34',
                                        fontWeight: 'bold',
                                    }}
                                    title="Progress gained since last update"
                                    aria-label={`Increased by ${gclDelta.toFixed(2)}%`}
                                >
                                    (+{gclDelta.toFixed(2)}%)
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        role="progressbar"
                        className="interactive-hint"
                        tabIndex={0}
                        aria-label="Global Control Level progress"
                        aria-describedby="gcl-percent"
                        aria-valuenow={Number(gclPercent.toFixed(2))}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuetext={`${gclPercent.toFixed(2)}% complete, ${(stats.gcl.progressTotal - stats.gcl.progress).toLocaleString()} XP remaining to level ${stats.gcl.level + 1}${getTimeToLevel() ? ` (est. ${formatDuration(getTimeToLevel()!)} to go)` : ''}`}
                        title={`${(stats.gcl.progressTotal - stats.gcl.progress).toLocaleString()} XP remaining to level ${stats.gcl.level + 1}${getTimeToLevel() ? ` (est. ${formatDuration(getTimeToLevel()!)} to go)` : ''}`}
                        style={{
                            width: '100%',
                            height: '12px',
                            background:
                                stats.gcl.progress >= stats.gcl.progressTotal
                                    ? '#333333'
                                    : '#eeeeee',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            position: 'relative',
                            marginBottom: '0.5rem',
                            borderBottom: 'none',
                        }}
                    >
                        {prevStats?.gcl &&
                            gclDelta > 0 &&
                            stats.gcl.level === prevStats.gcl.level && (
                                <div
                                    title={`Progress gained: ${gclDelta.toFixed(2)}% (from ${prevGclPercent.toFixed(2)}%)`}
                                    style={{
                                        left: `${prevGclPercent}%`,
                                        width: `${gclDelta}%`,
                                        height: '100%',
                                        position: 'absolute',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        animation: 'pulse 2s infinite',
                                        zIndex: 1,
                                    }}
                                />
                            )}
                        <div
                            style={{
                                width: `${gclPercent}%`,
                                height: '100%',
                                background:
                                    stats.gcl.progress >= stats.gcl.progressTotal
                                        ? '#FFD700'
                                        : '#006699',
                                transition: 'width 0.5s ease-in-out',
                            }}
                        />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#575757', textAlign: 'right' }}>
                        {stats.gcl.progress.toLocaleString()} /{' '}
                        {stats.gcl.progressTotal.toLocaleString()} (
                        {(stats.gcl.progressTotal - stats.gcl.progress).toLocaleString()} remaining
                        {getTimeToLevel() &&
                            ` • est. ${formatDuration(getTimeToLevel()!)} to level`}
                        )
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
                            boxShadow:
                                updated || copied
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
                                    ? '0 0 0 2px #ffffff, 0 0 0 4px #006699'
                                    : 'none',
                            }}
                        >
                            {copied ? '✅ Copied!' : '📋 Copy JSON'}
                        </button>
                        <pre
                            aria-label="Screeps statistics JSON. Press 'C' to copy."
                            className="interactive-hint"
                            title="Screeps statistics JSON (C to copy)"
                            tabIndex={0}
                            style={{
                                background: '#f8f8f8',
                                padding: '1rem',
                                borderRadius: '4px',
                                overflow: 'auto',
                                maxHeight: '500px',
                                margin: 0,
                                border: '1px solid #eee',
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
                                    background: updated ? '#1e7e34' : '#006699',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                    opacity: loading || isRefreshing ? 0.6 : 1,
                                    transition: 'all 0.2s',
                                }}
                            >
                                {updated ? (
                                    '✅ Updated!'
                                ) : isRefreshing ? (
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                animation: 'spin 1s linear infinite',
                                            }}
                                        >
                                            🔄
                                        </span>{' '}
                                        Refreshing Dashboard...
                                    </span>
                                ) : (
                                    '🔄 Refresh Dashboard'
                                )}
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
                    {[
                        {
                            k: 'R',
                            a: 'Refresh stats',
                            state: isRefreshing ? 'a' : updated ? 's' : '',
                            onClick: () => fetchStats(true),
                            icon: isRefreshing ? '🔄' : updated ? '✓' : 'R',
                        },
                        {
                            k: 'C',
                            a: 'Copy stats as JSON',
                            state: copied ? 's' : '',
                            onClick: () => handleCopy(),
                            icon: copied ? '✓' : 'C',
                        },
                        {
                            k: 'L',
                            a: 'Reset Secret',
                            state: isResetConfirming ? 'w' : resetSuccess ? 's' : '',
                            onClick: () => handleResetSecret(),
                            icon: resetSuccess ? '✓' : isResetConfirming ? '?' : 'L',
                        },
                    ].map((item, i) => (
                        <span key={item.k}>
                            {i > 0 && ' · '}
                            <kbd
                                role="button"
                                tabIndex={0}
                                onClick={item.onClick}
                                onKeyDown={(e) =>
                                    (e.key === 'Enter' || e.key === ' ') && item.onClick()
                                }
                                title={`Click or press ${item.k} to ${item.a}`}
                                aria-label={item.a}
                                style={{
                                    background:
                                        item.state === 'a'
                                            ? '#006699'
                                            : item.state === 's'
                                              ? '#1e7e34'
                                              : item.state === 'w'
                                                ? '#a5532d'
                                                : '#eee',
                                    color: item.state ? '#fff' : '#333',
                                    padding: '0.1rem 0.3rem',
                                    borderRadius: '3px',
                                    border: `1px solid ${item.state === 'a' ? '#005577' : item.state === 's' ? '#155d27' : item.state === 'w' ? '#7d3f22' : '#ccc'}`,
                                    boxShadow:
                                        '0 1px 1px rgba(0,0,0,0.2), 0 2px 0 0 rgba(255,255,255,0.7) inset',
                                    display: 'inline-block',
                                    minWidth: '1.2em',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    userSelect: 'none',
                                }}
                            >
                                {item.icon}
                            </kbd>{' '}
                            {item.a.replace(' stats', '').replace(' as JSON', '')}
                        </span>
                    ))}
                </div>
                <div>
                    Hover/Focus items with{' '}
                    <span className="interactive-hint">dotted underline</span> for details.
                </div>
            </footer>
        </main>
    );
}
