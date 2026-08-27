import React from 'react';
import { render } from 'react-dom';
import DependencyGraph from './components/DependencyGraph';
import IndexView from './components/IndexView';

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.
// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.
// Updated: Wrapped rendered content in <main> landmarks for accessibility (REACT_017).

import { content as dependencyGraphContent } from './content/dependencyGraphContent';
import { content as indexContent } from './content/indexContent';

function renderDependencyGraph() {
  return (
    <main>
      <DependencyGraph content={dependencyGraphContent} />
    </main>
  );
}

function renderIndexView() {
  return (
    <main>
      <IndexView content={indexContent} />
    </main>
  );
}

function App() {
  const [currentView, setCurrentView] = React.useState('index');
  
  const renderView = () => {
    switch (currentView) {
      case 'dependency-graph':
        return renderDependencyGraph();
      case 'index':
      default:
        return renderIndexView();
    }
  };

  return (
    <div className="app">
      <nav>
        <button onClick={() => setCurrentView('index')}>Index</button>
        <button onClick={() => setCurrentView('dependency-graph')}>Dependency Graph</button>
      </nav>
      {renderView()}
    </div>
  );
}

render(<App />, document.getElementById('root'));

export { renderDependencyGraph, renderIndexView, App };