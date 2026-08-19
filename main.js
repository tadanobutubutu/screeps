// src/components/StatsBoard.js
import React, { useState, useEffect, useRef } from 'react';
import { FaChartBar, FaCoins, FaLayerGroup, FaRedo } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function StatsBoard() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const [hoverStates, setHoverStates] = useState({});
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);

    const fetchStats = async (retry = false) => {
        try {
            if (retry) {
                setRefreshing(true);
                setError(null);
            }
            const res = await fetch('/api/stats');
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const data = await res.json();
            setStats(data);
            setError(null);
        } catch (err) {
            setError(err.message || t('errors.unknown'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [t]);

    const copyErr = () => {
        if (error) {
            navigator.clipboard.writeText(error);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const [copied, setCopied] = useState(false);

    if (loading && !stats) {
        return (
            <div className="stats-loading" aria-live="polite" role="status">
                <div className="spinner" aria-label={t('loading')}></div>
                <style>{`.spinner{border:4px solid #f3f3f3;border-top:4px solid #004b73;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:20px auto}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
                <h1 style={{ color: '#b71c1c' }}>⚠️ {t('errors.title')}</h1>
                <pre
                    tabIndex={0}
                    aria-label={t('errors.ariaLabel')}
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
                    aria-label={copied ? t('errors.copied') : t('errors.copy')}
                    title={copied ? t('errors.copied') : t('errors.copy')}
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
                    {copied ? '✅ ' + t('errors.copied') : '📋 ' + t('errors.copy')}
                </button>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    onMouseEnter={() => setErrRetryHover(true)}
                    onMouseLeave={() => setErrRetryHover(false)}
                    onFocus={() => setErrRetryHover(true)}
                    onBlur={() => setErrRetryHover(false)}
                    aria-label={t('errors.retry')}
                    style={{
                        backgroundColor: errRetryHover ? '#005f8f' : '#004b73',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                >
                    <FaRedo /> {t('errors.retry')}
                </button>
            </section>
        );
    }

    const handleCardClick = (path) => {
        setHoverStates((prev) => ({ ...prev, [path]: true }));
        navigate(path);
    };

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            {refreshing && (
                <div className="refreshing-overlay">
                    <div className="spinner"></div>
                    <style>{`.spinner{border:4px solid #f3f3f3;border-top:4px solid #004b73;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:20px auto}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
                </div>
            )}
            <h1>📊 {t('dashboard.title')}</h1>
            <div className="stats-grid">
                {[
                    {
                        icon: FaChartBar,
                        label: t('stats.totalQueries'),
                        value: stats?.totalQueries ?? 0,
                        color: '#004b73',
                        path: '/queries',
                    },
                    {
                        icon: FaCoins,
                        label: t('stats.totalCredits'),
                        value: stats?.totalCredits ?? 0,
                        color: '#155d27',
                        path: '/credits',
                    },
                    {
                        icon: FaLayerGroup,
                        label: t('stats.totalModels'),
                        value: stats?.totalModels ?? 0,
                        color: '#5c2d91',
                        path: '/models',
                    },
                ].map(({ icon: Icon, label, value, color, path }) => (
                    <div
                        key={path}
                        onClick={() => handleCardClick(path)}
                        onMouseEnter={() => setHoverStates((prev) => ({ ...prev, [path]: true }))}
                        onMouseLeave={() => setHoverStates((prev) => ({ ...prev, [path]: false }))}
                        onFocus={() => setHoverStates((prev) => ({ ...prev, [path]: true }))}
                        onBlur={() => setHoverStates((prev) => ({ ...prev, [path]: false }))}
                        className="stat-card"
                        tabIndex={0}
                        role="button"
                        aria-label={`${label}: ${value}`}
                        style={{
                            backgroundColor: hoverStates[path] ? '#f0f4f8' : '#ffffff',
                            transform: hoverStates[path] ? 'translateY(-4px)' : 'translateY(0)',
                            boxShadow: hoverStates[path]
                                ? '0 8px 16px rgba(0, 75, 115, 0.2)'
                                : '0 2px 4px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease-in-out',
                            cursor: 'pointer',
                        }}
                    >
                        <Icon
                            style={{
                                color: color,
                                fontSize: '2rem',
                                marginBottom: '0.5rem',
                            }}
                        />
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>
                            {value.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#555' }}>{label}</div>
                    </div>
                ))}
            </div>
        </main>
    );
}