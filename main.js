import React, { useState } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [error, setError] = useState(false);

  // Error state – use a <section> (or <article>) instead of a second <main>
  if (error) {
    return (
      <section aria-labelledby="error-heading" className={styles.error}>
        <h1 id="error-heading">エラー</h1>
        <p>エラーが発生しました。</p>
      </section>
    );
  }

  // Success state – keep the single <main> landmark
  return (
    <main>
      <h1>Dashboard</h1>
      <p>データが表示されています。</p>
    </main>
  );
}