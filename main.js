import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div>
      <button id="unrotate" type="button">rotate back</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
export default App;