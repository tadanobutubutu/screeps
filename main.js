import { render } from 'react';
import { App } from './components/App';

const rootElement = document.getElementById('root');
if (rootElement) {
  render(<App />, rootElement);
}