tsx
import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CopyToClipboard from 'react-copy-to-clipboard';
import CopyIcon from '@material-ui/icons/ContentCopy';
import ErrorIcon from '@material-ui/icons/Error';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_SELECTORS, MAIN_ACTIONS } from '../../reducers/main';
import { selectUsername, selectError } from '../../reducers/common';
import { useDimensions } from '../../hooks';
import ScreepsImage from '../ScreepsImage';
import ScreenReaderAnnouncer from '../ScreenReaderAnnouncer';
import LiveDevDen from '../development/LiveDevDen';
import BaseStatPanel from '../stat-panels/BaseStatPanel';

const useStyles = makeStyles({
  root: {
    fontSize: '1.2em',
    fontFamily: 'monospace',
  },
  pre: {
    color: '#c53030',
    backgroundColor: '#fff5f5',
    padding: '1rem',
    borderRadius: `4px`,
    overflow: 'auto',
  },
  button: {
    backgroundColor: (props) =>
      props.copied
        ? '#155d27'
        : props.theme.palette.primary.main,
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: `4px`,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    transform: (props) => (props.hover ? 'scale(1.05)' : 'scale(1)'),
    boxShadow: (props) =>
      props.hover
        ? '0 4px 10px rgba(0, 75, 115, 0.3)'
        : 'none',
    filter: (props) => (props.hover ? 'brightness(1.1)' : 'none'),
  },
});

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const dimensions = useDimensions();
  const username = useSelector(selectUsername);
  const error = useSelector(selectError);
  const refreshing = useSelector(MAIN_SELECTORS.isLoading);
  const statusCode = useSelector(MAIN_SELECTORS.statusCode);

  const copyErr = () => {
    dispatch(MAIN_ACTIONS.setErrorCopied(true));
  };

  const fetchStats = (isReset) => {
    dispatch(MAIN_ACTIONS.fetchStats(isReset));
  };

  // code...
};

export default Dashboard;