// main.js
import React from 'react';
import ReactDOM from 'react-dom/root';
import App from './App';

const handleUnrotate = () => {
    const image = document.getElementById('rotatable-image')
    if (image) {
        image.style.transform = 'rotate(0deg)'
    }
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            errorInfo: null,
            hasError: false
        }
        this.handleReload = this.handleReload.bind(this)
    }

    componentDidMount() {
        const unrotateBtn = document.getElementById('unrotate-btn')
        if (unrotateBtn) {
            unrotateBtn.addEventListener('click', handleUnrotate)
        }
    }

    componentWillUnmount() {
        const unrotateBtn = document.getElementById('unrotate-btn')
        if (unrotateBtn) {
            unrotateBtn.removeEventListener('click', handleUnrotate)
        }
    }

    handleReload() {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <section
                    role="alert"
                    aria-labelledby="error-heading"
                    style={{ padding: '2rem', fontFamily: 'monospace' }}
                >
                    <h1 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
                    <div
                        tabIndex={0}
                        role="region"
                        aria-label="エラーメッセージ詳細"
                        style={{
                            color: '#c53030',
                            backgroundColor: '#fff5f5',
                            padding: '1rem',
                            borderRadius: '4px',
                            overflow: 'auto',
                        }}
                    >
                        <p>{this.state.error && this.state.error.toString()}</p>
                        <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
                    </div>
                    <button
                        id="reload-btn"
                        onClick={this.handleReload}
                        style={{
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        aria-label="ページを再読み込み"
                    >
                        🔄 ページを再読み込み
                    </button>
                </section>
            )
        }

        return this.props.children
    }
}

const AppLayout = ({ children }) => (
  <body lang="en" className="min-h-screen flex flex-col">
    <main>{children}</main>
  </body>
);

const DashboardLayout = ({ children }) => (
  <body lang="en">
    <main>{children}</main>
  </body>
);

const DependencyGraph = () => (
  <main>
    <table id="table-rotated">
      {/* Table content */}
    </table>
  </main>
);

const DocsIndex = () => (
  <main>
    <div className="container">
      <h2>Quality & Metrics Reports</h2>
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div className="links">
        <a href="/dependency-graph">Plato Code Complexity Report</a>
        <a href="/dependency-graph">Dependency Graph</a>
      </div>
    </div>
  </main>
);

const ensureTableAccessibility = () => {
    // This would be called after the table is rendered
    // For static HTML, we would need to modify the HTML directly
    // For React components, we would ensure proper props are passed
    console.log('Ensuring table accessibility - scope attributes should be added in the table component');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export { ErrorBoundary, handleUnrotate, ensureTableAccessibility, AppLayout, DashboardLayout, DependencyGraph, DocsIndex };