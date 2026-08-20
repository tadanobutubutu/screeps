import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Assuming that the issue is about the potential duplication of <main> elements in the App component,
// we will refactor the App component to avoid having multiple <main> elements.

// Here is a hypothetical refactoring of the App component:
// If the actual App component has multiple <main> elements, we would need to integrate the following
// into the App component's code, possibly by splitting the component into smaller ones or
// by using conditional rendering.

// Refactored App component example:
// class App extends React.Component {
//   render() {
//     const { error, success, refreshing, copied, errCopyHover, errRetryHover } = this.props;
//     return (
//       <div>
//         {/* Render the error state or success state, but only one <main> */}
//         {error ? (
//           <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
//             <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
//             {/* ... error content */}
//           </main>
//         ) : success ? (
//           <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
//             <h1 style={{ color: '#155d27' }}>🌟 Success</h1>
//             {/* ... success content */}
//           </main>
//         ) : (
//           {/* ... other content */}
//         )}
//       </div>
//     );
//   }
// }

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);