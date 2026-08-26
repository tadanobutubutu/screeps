// Main.js - Main component displaying stats or error
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../utils/error';
import { useFetch } from '../hooks/useFetch';
import { useStats } from '../hooks/useStats';
import { usePageView } from '../hooks/usePageView';
import { useCopy } from '../hooks/useCopy';
import Stats from './stats';
import { useDeviceData } from '../hooks/useDeviceData';
import { getBrowserInfo } from '../utils/browser';

const Main = ({ onShowSupportModal }) => {
    usePageView();
    const [refreshing, setRefreshing] = useState(false);
    const { data, loading, error, revalidate } = useStats();

    const [errRetryHover, setErrRetryHover] = useState(false);
    const { copyErr, copied, errCopyHover } = useCopy();

    const deviceData = useDeviceData();
    const browserInfo = getBrowserInfo();

    const fetchStats = async (bypassCache = false) => {
        setRefreshing(true);
        try {
            await revalidate({ bypassCache });
        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
        }
    };

    if (error) {
        return (
            <main role="main">
                <section aria-labelledby="error-heading">
                    <h1 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
                        style={{
                            backgroundColor: errRetryHover ? '#004b73' : '#155d27',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '0.5rem',
                            transition: 'all 0.2s ease-in-out',
                            transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                        }}
                    >
                        {refreshing ? '🔄 更新中...' : '🔄 再試行'}
                    </button>
                </section>
            </main>
        );
    }

    if (loading && !data) {
        return (
            <main role="main">
                <section className="loading-section" aria-label="読み込み中">
                    <div className="loading-spinner"></div>
                    <p>データを読み込み中...</p>
                </section>
            </main>
        );
    }

    return (
        <main role="main">
            <section aria-labelledby="stats-heading">
                <h1 id="stats-heading" className="sr-only">統計情報</h1>
                {data && <Stats stats={data} />}
            </section>
        </main>
    );
};

export default Main;