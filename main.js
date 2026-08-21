import { render } from 'react';
import { App } from './components/App';

// Assuming 'rootElement' is the same element as before, no change needed here.
const rootElement = document.getElementById('root');

// The following render call is unchanged, no change needed here.
if (rootElement) {
  render(<App />, rootElement);
}