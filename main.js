import React, { useState, useEffect, useCallback } from 'react';
import './main.css';

// Mock functions that would typically come from external sources
const fetchStatsData = async (refresh = false) => {
    // Simulated API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (refresh || Math.random() > 0.3) {
                resolve({
                    totalViews: 125430,
                    totalClicks: 8934,
                    conversionRate: 7.12,
                    topPages: [
                        { path: '/home', views: 45321, clicks: 3201 },
                        { path: '/products', views: 28934, clicks: 2156 },
                        { path: '/about', views: 18234, clicks: 1203 }
                    ],
                    lastUpdated: new Date().toISOString()
                });
            } else {
                reject(new Error('Failed to fetch statistics. Please try again later.'));
            }
        }, 800);
    });
};

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

function Main() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hoverStates, setHoverStates] = useState({
        copy: false,
        retry: false,
        refresh: false
    });

    const fetchStats = useCallback(async (refresh = false) => {
        if (refresh) {
            setRefreshing(true);
        }
        setError(null);
        
        try {
            const data = await fetchStatsData(refresh);
            setStats(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setStats(null);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleCopy = async () => {
        if (!stats) return;
        const text = JSON.stringify(stats, null, 2);
        const success = await copyToClipboard(text);
        if (success) {
            setTimeout(() => {
                // Reset copy state after 2 seconds
            }, 2000);
        }
    };

    const handleMouseEnter = (button) => {
        setHoverStates(prev => ({ ...prev, [button]: true }));
    };

    const handleMouseLeave = (button) => {
        setHoverStates(prev => ({ ...prev, [button]: false }));
    };

    // Error state - use <section> instead of <main>
    if (error) {
        return (
            <section 
                className="main-container"
                aria-live="polite"
                aria-atomic="true"
            >
                <div className="error-wrapper">
                    <div className="error-content">
                        <h1 className="error-title">⚠️ エラー</h1>
                        <pre
                            tabIndex={0}
                            aria-label="エラーメッセージ詳細"
                            className="error-message"
                        >
                            {error}
                        </pre>
                        <div className="error-actions">
                            <button
                                onClick={handleCopy}
                                onMouseEnter={() => handleMouseEnter('copy')}
                                onMouseLeave={() => handleMouseLeave('copy')}
                                onFocus={() => handleMouseEnter('copy')}
                                onBlur={() => handleMouseLeave('copy')}
                                aria-label="エラーをクリップボードにコピー"
                                title="エラーをコピー"
                                className="btn btn-secondary"
                            >
                                📋 エラーをコピー
                            </button>
                            <button
                                onClick={() => fetchStats(true)}
                                disabled={refreshing}
                                onMouseEnter={() => handleMouseEnter('retry')}
                                onMouseLeave={() => handleMouseLeave('retry')}
                                onFocus={() => handleMouseEnter('retry')}
                                onBlur={() => handleMouseLeave('retry')}
                                aria-label="統計情報を再取得"
                                title="再試行"
                                className="btn btn-primary"
                            >
                                🔄 {refreshing ? '読み込み中...' : '再試行'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Loading state
    if (loading) {
        return (
            <main className="main-container">
                <div className="loading-wrapper">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">データを読み込み中...</p>
                </div>
            </main>
        );
    }

    // Success state - keep the <main> landmark
    return (
        <main className="main-container" role="main">
            <header className="stats-header">
                <div className="header-content">
                    <h1 className="page-title">📊 統計ダッシュボード</h1>
                    <button
                        onClick={() => fetchStats(true)}
                        disabled={refreshing}
                        onMouseEnter={() => handleMouseEnter('refresh')}
                        onMouseLeave={() => handleMouseLeave('refresh')}
                        onFocus={() => handleMouseEnter('refresh')}
                        onBlur={() => handleMouseLeave('refresh')}
                        aria-label="統計情報を更新"
                        title="更新"
                        className="btn btn-refresh"
                    >
                        {refreshing ? '🔄 更新中...' : '🔄 更新'}
                    </button>
                </div>
                <p className="last-updated">
                    最終更新: {stats && formatDate(stats.lastUpdated)}
                </p>
            </header>

            <div className="stats-grid">
                <article className="stat-card">
                    <h2 className="stat-title">総閲覧数</h2>
                    <p className="stat-value">{formatNumber(stats.totalViews)}</p>
                    <p className="stat-label">PV</p>
                </article>

                <article className="stat-card">
                    <h2 className="stat-title">総クリック数</h2>
                    <p className="stat-value">{formatNumber(stats.totalClicks)}</p>
                    <p className="stat-label">クリック</p>
                </article>

                <article className="stat-card">
                    <h2 className="stat-title">コンバージョン率</h2>
                    <p className="stat-value">{stats.conversionRate}%</p>
                    <p className="stat-label">CVR</p>
                </article>
            </div>

            <section className="top-pages-section">
                <h2 className="section-title">🔥 人気ページ TOP 3</h2>
                <div className="pages-list">
                    {stats.topPages.map((page, index) => (
                        <article key={page.path} className="page-item">
                            <div className="page-rank">#{index + 1}</div>
                            <div className="page-info">
                                <h3 className="page-path">{page.path}</h3>
                                <p className="page-stats">
                                    閲覧: {formatNumber(page.views)} | 
                                    クリック: {formatNumber(page.clicks)}
                                </p>
                            </div>
                            <div className="page-ctr">
                                CTR: {((page.clicks / page.views) * 100).toFixed(2)}%
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <footer className="stats-footer">
                <button
                    onClick={handleCopy}
                    onMouseEnter={() => handleMouseEnter('export')}
                    onMouseLeave={() => handleMouseLeave('export')}
                    onFocus={() => handleMouseEnter('export')}
                    onBlur={() => handleMouseLeave('export')}
                    aria-label="統計データをクリップボードにコピー"
                    title="データをコピー"
                    className="btn btn-export"
                >
                    📋 データをコピー
                </button>
            </footer>
        </main>
    );
}

export default Main;

export const getStatsSummary = (stats) => {
    if (!stats) return '統計データなし';
    return `総閲覧数: ${formatNumber(stats.totalViews)}, 総クリック数: ${formatNumber(stats.totalClicks)}, コンバージョン率: ${stats.conversionRate}%`;
};

export const exportStatsAsJSON = (stats) => {
    return JSON.stringify(stats, null, 2);
};

export { formatNumber, formatDate };