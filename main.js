// @ts-check
'use strict';

const { React } = require('csz/vendor/react');
const { createElement: h, useState, useEffect } = React;

const MAX_PAST_RANKINGS = 10;

/**
 * @param {{ api: import('../api').default }} opts
 */
module.exports = function RankChart({ api }) {
    const [rank, setRank] = useState(null);
    const [rankHistory, setRankHistory] = useState([]);
    const [rankHistoryTime, setRankHistoryTime] = useState([]);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);

    const fetchStats = (bustCache) => {
        setRefreshing(true);
        setError(null);
        return api
            .rankHistory({ cache: !bustCache })
            .then((res) => {
                const r = res.ranking;
                setRank(r);
                const newRankHistory = res.history.map((x) => x.ranking).reverse();
                setRankHistory(newRankHistory);
                setRankHistoryTime(
                    res.history.map((x) => {
                        const d = new Date(x.date);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                    }).reverse(),
                );
                if (res.shard) {
                    const spl = res.shard.split('-');
                    setStats({
                        nps: res.nps,
                        npsCount: res.npsCount,
                        active: res.active,
                        players: res.players,
                        shard: spl[0],
                        mode: spl[1],
                        interval: res.interval,
                        vs: res.vs,
                    });
                }
                setRefreshing(false);
            })
            .catch((e) => {
                setRefreshing(false);
                setError(e);
            });
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const copyErr = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(String(error)).then(() => setCopied(true));
        }
    };

    if (error !== null) {
        return h('section', { style: { padding: '2rem', fontFamily: 'monospace' } },
            h('h1', { style: { color: '#b71c1c' } }, '⚠️ エラー'),
            h('pre', {
                tabIndex: 0,
                'aria-label': 'エラーメッセージ詳細',
                style: {
                    color: '#c53030',
                    backgroundColor: '#fff5f5',
                    padding: '1rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                },
            }, String(error)),
            h('button', {
                onClick: copyErr,
                onMouseEnter: () => setErrCopyHover(true),
                onMouseLeave: () => setErrCopyHover(false),
                onFocus: () => setErrCopyHover(true),
                onBlur: () => setErrCopyHover(false),
                'aria-label': copied ? 'コピー済み' : 'エラーをコピー',
                title: copied ? 'コピー済み' : 'エラーをコピー',
                style: {
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
                },
            }, copied ? '✅ コピー済み' : '📋 エラーをコピー'),
            h('button', {
                onClick: () => fetchStats(true),
                disabled: refreshing,
                onMouseEnter: () => setErrRetryHover(true),
                onMouseLeave: () => setErrRetryHover(false),
                'aria-label': 'リトライ',
                style: {
                    backgroundColor: refreshing ? '#999' : '#004b73',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: refreshing ? 'not-allowed' : 'pointer',
                    marginLeft: '0.5rem',
                    transition: 'all 0.2s ease-in-out',
                    transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                    filter: errRetryHover ? 'brightness(1.1)' : 'none',
                },
            }, refreshing ? '🔄 読み込み中...' : '🔄 リトライ'),
        );
    }

    return h('main', { style: { padding: '2rem' } },
        h('div', { style: { marginBottom: '1rem' } },
            h('h1', null, 'ランキング'),
            h('small', null,
                stats
                    ? `上次更新: ${new Date(stats.interval.start).toLocaleString()}`
                    : '読み込み中...',
            ),
            ' ',
            h('button', {
                onClick: () => fetchStats(true),
                disabled: refreshing,
                'aria-label': '更新',
                style: {
                    backgroundColor: refreshing ? '#9e9e9e' : '#004b73',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: refreshing ? 'not-allowed' : 'pointer',
                },
            }, refreshing ? '🔄 読み込み中...' : '🔄 更新'),
        ),
        typeof rank === 'number'
            ? h('div', { class: 'text-center' },
                h('h2', { style: { fontSize: '4em', lineHeight: 1, margin: '0.5rem 0' } }, `#${rank}`),
                h('small', { style: { color: '#666' } }, stats ? `${stats.active} アクティブプレイヤー` : ''),
              )
            : h('p', { style: { fontSize: '2em', margin: '1rem 0', color: '#666' } }, '読み込み中...'),
        stats && h('div', { class: 'panel panel-primary', style: { marginBottom: '1rem' } },
            h('div', { class: 'panel-heading', style: { fontWeight: 'bold' } }, 'サーバー統計'),
            h('div', { class: 'panel-body', style: { display: 'flex', flexWrap: 'wrap', gap: '1rem' } },
                h('div', null,
                    h('div', { style: { fontSize: '2em', fontWeight: 'bold' } }, stats.players),
                    h('small', null, '登録ユーザー'),
                ),
                h('div', null,
                    h('div', { style: { fontSize: '2em', fontWeight: 'bold' } }, stats.active),
                    h('small', null, 'アクティブ'),
                ),
                h('div', null,
                    h('div', { style: { fontSize: '2em', fontWeight: 'bold' } }, stats.nps),
                    h('small', null, `NPS (${stats.npsCount} サンプル)`),
                ),
                h('div', null,
                    h('div', { style: { fontSize: '1.5em', fontWeight: 'bold' } }, stats.shard),
                    h('small', null, 'サーバー'),
                ),
                h('div', null,
                    h('div', { style: { fontSize: '1.5em', fontWeight: 'bold' } }, stats.mode),
                    h('small', null, 'モード'),
                ),
                stats.vs > 0 && h('div', null,
                    h('div', { style: { fontSize: '2em', fontWeight: 'bold' } }, stats.vs),
                    h('small', null, 'PVP 戦'),
                ),
            ),
        ),
        h('canvas', { id: 'rankChart', role: 'img', 'aria-label': 'ランキング履歴グラフ' }),
        h('style', null, `
            #rankChart {
                max-height: 400px;
            }
            @media (max-width: 768px) {
                #rankChart {
                    max-height: 300px;
                }
            }
        `),
    );
};