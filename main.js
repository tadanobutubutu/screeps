tsx
import React, { useState } from 'react';
import styles from './Dashboard.module.scss';
import { useTranslation } from 'react-i18next';
import { forwardRef } from 'react';
import { CodeBlock, FormattedError, useCopyToClipboard } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import useStats, { Stats } from '../hooks/useStats';
import PageLoader from './PageLoader';
import { Container, Row, Col } from 'reactstrap';
import ResultStats from '../components/ResultStats';
import ErrorBanner from '../components/ErrorBanner';

const CustomLink = forwardRef(({ children, href, ...props }, ref) => (
  <Link to={href} innerRef={ref} {...props}>
    {children}
  </Link>
));

function Dashboard() {
  const [copied, copyErr] = useCopyToClipboard();
  const [refreshing, fetchStats] = useStats();
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const checkUrl = location.pathname.includes('battle')
    ? location.pathname.replace('battle', 'battle-history')
    : location.pathname + 'battle';

  const error = `
    ${t(
      'コンパイルやデプロイを行っている間にすべての機能は動作しない場合があります。'
    )}
    ${t(
      'デプロイには一時待つか、[エラーメッセージ]をコピーしてプロジェクトのチケットに作成することをお勧めします。'
    )}
  `;

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <CustomLink to={checkUrl}>ログレーター</CustomLink>
      <h1 style={{ color: '#b71c1c' }}>{t('エラー')}</h1>
      <PreError err={error} copied={copied} copyErr={copyErr} />
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
      >
        再試行
      </button>
    </div>
  );
}

export default Dashboard;