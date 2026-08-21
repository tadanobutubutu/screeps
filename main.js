// Assuming the main component file is 'MainComponent.tsx'
// and the file with the duplicate <main> is 'Dashboard.tsx'

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import MainComponent from './MainComponent'; // The main component file
import Dashboard from './Dashboard'; // The file with the duplicate <main>

const App = () => {
  return (
    <Router>
      <MainComponent />
      {/* Remove the duplicate <main> element from Dashboard */}
      {/* <Dashboard /> */}
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

(function() {
    var tableRotated = "<table id=\"table-rotated\"><thead><tr><th>Column 1</th><th>Column 2</th></tr></thead><tbody><tr><td>Data 1</td><td>Data 2</td></tr></tbody></table>";
    
    function renderMain() {
        var container = document.createElement('div');
        container.innerHTML = '<main>' + tableRotated + '</main>';
        return container.innerHTML;
    }
    
    function init() {
        var mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = '<main>' + tableRotated + '</main>';
        }
    }
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { renderMain: renderMain, init: init };
    }
    
    if (typeof window !== 'undefined') {
        window.renderMain = renderMain;
        window.init = init;
    }
})();