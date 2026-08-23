import './styles.css';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  // TODO: Address accessibility issues from insight report:
  // - REACT_015: Add lang attribute to HTML element
  // Fix language for the HTML root element
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }

  const root = document.getElementById('root');
  if (root) {
    import('./App')
      .then(({ default: App }) => {
        import('react-dom/client').then((ReactDOM) => {
          const container = document.getElementById('root');
          if (container) {
            const heading = document.createElement('h1');
            heading.textContent = 'Welcome to My App';
            heading.setAttribute('lang', 'en');
            container.appendChild(heading);
          }
        });
      })
      .catch((err) => {
        console.error('Failed to load App:', err);
      });
  }
});

export const initializeApp = () => {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
  return true;
};

export default { initializeApp };