import React from 'react';
import ReactDOM from 'react-dom/client';

function Main() {
  // Root html with language attribute for screen readers
  const html = React.createElement('html', { lang: 'en' });
  const body = React.createElement('body');

  // Navigation landmark
  const nav = React.createElement('nav', { id: 'nav', role: 'navigation' },
    React.createElement('ul', null,
      React.createElement('li', null, 'Navigation'),
      React.createElement('li', null, 'Main Content')
    )
  );

  // Main content landmark
  const mainContent = React.createElement('main', { id: 'main', role: 'main' },
    React.createElement('h1', null, 'Welcome'),
    React.createElement('p', null, 'This is a sample page.'),
    React.createElement('table', { role: 'table' },
      React.createElement('tr', null,
        React.createElement('th', { scope: 'col' }, 'Name'),
        React.createElement('th', { scope: 'col' }, 'Age')
      ),
      React.createElement('tr', null,
        React.createElement('td', null, 'Alice'),
        React.createElement('td', null, '30')
      ),
      React.createElement('tr', null,
        React.createElement('td', null, 'Bob'),
        React.createElement('td', null, '25')
      )
    ),
    // SVG with accessible name
    React.createElement('svg', { ariaLabel: 'Simple circle icon' },
      React.createElement('circle', { cx: '50', cy: '50', r: '40', fill: 'none', stroke: 'black' })
    )
  );

  // Footer landmark
  const footer = React.createElement('footer', { id: 'footer', role: 'contentinfo' },
    React.createElement('p', null, 'Footer content')
  );

  // Assemble the page
  const appDiv = React.createElement('div', { className: 'app' }, [nav, mainContent, footer]);

  // Root element with language attribute
  const root = React.createElement('html', { lang: 'en' }, [body, appDiv]);

  ReactDOM.createRoot(document.documentElement).render(root);

  return appDiv;
}

export default Main;