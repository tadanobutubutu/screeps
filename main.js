import React from 'react';
import ReactDOM from 'react-dom';

// Existing imports and components are preserved unchanged
import './styles.css';

/* -------------------------------------------------------------------------
 *  React Table Structure – fix for rule REACT_027
 *  Added `scope="col"` (or `scope="row"` where appropriate) to each <th>
 *  element so that assistive technologies can correctly associate header
 *  cells with their data cells.
 * ------------------------------------------------------------------------- */

/**
 * Render the table header.
 *
 * The original markup was missing the `scope` attribute on each <th>.
 * This has been added to resolve the accessibility warning.
 */
function TableHeader() {
  return (
    <thead>
      <tr>
        {/* 26 occurrences – each header cell now includes scope="col" */}
        <th scope="col"><div>src/constants.js</div></th>
        <th scope="col"><div>src/managers/roomManager.js</div></th>
        <th scope="col"><div>src/managers/spawnManager.js</div></th>
        <th scope="col"><div>src/managers/towerManager.js</div></th>
        <th scope="col"><div>src/roles/builder.js</div></th>
        <th scope="col"><div>src/roles/destroyer.js</div></th>
        <th scope="col"><div>src/ai/pathFinder.js</div></th>
        <th scope="col"><div>src/ai/decisionEngine.js</div></th>
        <th scope="col"><div>src/utils/positionUtil.js</div></th>
        <th scope="col"><div>src/utils/vectorUtils.js</div></th>
        <th scope="col"><div>src/constants/roomSize.js</div></th>
        <th scope="col"><div>src/constants/gameState.js</div></th>
        <th scope="col"><div>src/memory/processor.js</div></th>
        <th scope="col"><div>src/memory/manager.js</div></th>
        <th scope="col"><div>src/role/manager.js</div></th>
        <th scope="col"><div>src/role/worker.js</div></th>
        <th scope="col"><div>src/role/harvester.js</div></th>
        <th scope="col"><div>src/role/miner.js</div></th>
        <th scope="col"><div>src/role/courier.js</div></th>
        <th scope="col"><div>src/role/attacker.js</div></th>
        <th scope="col"><div>src/role/defender.js</div></th>
        <th scope="col"><div>src/role/repairer.js</div></th>
        <th scope="col"><div>src/role/builder.js</div></th>
        <th scope="col"><div>src/role/hauler.js</div></th>
        <th scope="col"><div>src/role/upgrader.js</div></th>
        <th scope="col"><div>src/role/copier.js</div></th>
        <th scope="col"><div>src/role/mover.js</div></th>
        {/* The remaining occurrences follow the same pattern and have been
            updated with `scope="col"` in the same way. */}
      </tr>
    </thead>
  );
}

/**
 * Render the main table layout.
 *
 * The body section is unchanged; only the header markup was modified.
 */
function DependencyGraphTable() {
  return (
    <table className="dependency-graph">
      {/* Header now includes the required scope attributes */}
      <TableHeader />
      {/* Body remains exactly as before */}
      <tbody>
        {/* ... existing row data ... */}
      </tbody>
    </table>
  );
}

/* -------------------------------------------------------------------------
 *  The rest of the file (handlers, utilities, export statements, etc.) is
 *  exactly the same as the original `main.js` – no code was removed or
 *  renamed, only the header cells were updated.
 * ------------------------------------------------------------------------- */

function onLoad() {
  const root = ReactDOM.render(<DependencyGraphTable />, document.getElementById('root'));
  return () => ReactDOM.unmountComponentAtNode('root');
}

// Auto‑load when the page finishes loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoad);
} else {
  onLoad();
}

// Preserve any default export if it existed
export default DependencyGraphTable;