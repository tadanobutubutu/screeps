tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { CircularProgress, IconButton, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import CopyToClipboard from 'react-copy-to-clipboard';
import { logout } from '../../features/auth/authSlice';
import { fetchStats } from '../../features/stats/statsSlice';

const Dashboard = () => {
  // Your existing code

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Keep error state return path as is */}

      {!error && (
        <>
          {/* Replace <main> with <article> in the success state return path */}
          <article>
            {/* Your existing code */}
          </article>
        </>
      )}

      {/* Keep the rest of the code as is */}
    </div>
  );
};

export default Dashboard;