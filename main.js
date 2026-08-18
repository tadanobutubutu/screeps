import React, { useState } from 'react';
import Chart from './Chart.js';
// ... existing imports and declarations ...

function DependencyGraph(props) {
  // ... existing function body and state ...

  // Replace the <a> with <button>
  const unrotateBtn = (
    <button id="unrotate" onClick={handleBtnClick}>
      rotate back
    </button>
  );

  // In handleBtnClick function, use `props.reverseGraph()` instead of setting state `this.state.reverse`
  const handleBtnClick = () => {
    props.reverseGraph();
  };

  // ... continue with existing render method ...

  return (
    // ... existing return statement ...
    // Add unrotateBtn before closing the ChartDOM element
    <div ref={this.ChartDOM} className={clsx(classes.chart)}>{chart}</div>
    {unrotateBtn}
    // ... closing tags and imports
  );
}

export default DependencyGraph;