import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './app/layout';
import Dashboard from './components/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Layout>
      <Dashboard />
    </Layout>
  </React.StrictMode>
);

export default root;