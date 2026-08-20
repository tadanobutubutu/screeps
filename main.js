tsx
import _ from 'lodash';
import React, { useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { httpErrorNotification } from "../../reducers/notificationSlice";
import { copyToClipboard } from '../../utils/commonUtil';
import { setIsVisible } from "../../reducers/uiSlice";

const Dashboard = () => {
  // ... other code

  return (
    <>
      {error ? (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
          {/* ... other error state components */}
        </main>
      ) : (
        // keep the success state return path
        // ... success state components
      )}
      {/* ... other components */}
      <ToastContainer />
    </>
  );
};

export default Dashboard;