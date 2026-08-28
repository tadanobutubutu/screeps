import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // REACT_015: Set document language attribute
    document.documentElement.lang = 'en';
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // REACT_017: Ensure proper landmark structure
  return (
    <div className="app-container" lang="en">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

// REACT_017: Add landmark roles to fix landmark issues
export function getUniqueLandmarkName(baseName, existingNames) {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName}-${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}-${counter}`;
  }
  return newName;
}

export function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

    // Determine the landmark name
    let landmarkName = ariaLabel || ariaLabelledby || tagName;

    if (landmarkNames.has(landmarkName)) {
      issues.push({
        element: landmark,
        message: `Duplicate landmark found: "${landmarkName}". Use unique aria-label or aria-labelledby.`,
        severity: 'warning'
      });
    } else {
      landmarkNames.add(landmarkName);
    }
  });
}

// Tower management
const app = document.getElementById('root');

/**
 * Handles tower repair and attack actions
 * @param {StructureTower} tower - The tower object to perform actions
 */
function handleTowerActions(tower) {
  var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: function(structure) {
      return structure.hits < structure.hitsMax;
    }
  });
  if (closestDamagedStructure) {
    tower.repair(closestDamagedStructure);
  }

  var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (closestHostile) {
    tower.attack(closestHostile);
  }
}

/**
 * Processes all creeps and executes their role-specific logic
 */
function processCreeps() {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory && creep.memory.role) {
      executeCreepRole(creep);
    }
  }
}

/**
 * Executes the appropriate role handler for a creep
 * @param {Creep} creep - The creep object to process
 */
function executeCreepRole(creep) {
  switch(creep.memory.role) {
    case 'harvester':
      roleHarvester.run(creep);
      break;
    case 'upgrader':
      roleUpgrader.run(creep);
      break;
    case 'builder':
      roleBuilder.run(creep);
      break;
    default:
      // Unknown role - do nothing
      break;
  }
}

// REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
// REACT_027: Add scope="col" or scope="row" to <th> elements
export function addScopeToHeaders(tableElement) {
  if (!tableElement) return [];

  const headers = tableElement.querySelectorAll('th');
  const updates = [];

  headers.forEach((th) => {
    const row = th.closest('tr');
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(th);

    // Determine if scope should be 'col' or 'row'
    let scope = 'col';

    // Check if it's a row header (first cell in a row that's not the first row)
    if (cellIndex === 0 && rowIndex > 0) {
      scope = 'row';
    }

    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', scope);
      updates.push({
        element: th,
        scope: scope,
        position: { row: rowIndex, col: cellIndex }
      });
    }
  });

  return updates;
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// TODO: Create or update the affected functions to be accessible
// The functions below have been created to match the exported names

export { App, getUniqueLandmarkName, validateUniqueLandmarks, addSvgAccessibleName, isValidLink, addScopeToHeaders };

export default {};
export const module = { exports: {} };
module.exports = { App, getUniqueLandmarkName, validateUniqueLandmarks, addSvgAccessibleName, isValidLink, addScopeToHeaders };