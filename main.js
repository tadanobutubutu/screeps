import './wdyr';
import { createRoot } from 'react-dom/client';
import App from 'next/app';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import '../styles/globals.css';

class MyApp extends App {
  componentDidMount() {
    // Accessibility fix: Set lang attribute on HTML element if not present
    // This addresses REACT_015 (React Language Attribute)
    const htmlTag = document.documentElement;
    if (!htmlTag.lang) {
      htmlTag.lang = 'en';
    }
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    );
  }
}

export default withRedux(store)(MyApp);