import './styles.less';
import react from 'react';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';

import fs from 'fs';
import path from 'path';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React from 'react'; // Include React for test compatibility

// ... (as is) Node.js functions for dependency visualization tool

const App = () => {
  const [programData, setProgramData] = useState(null);

  useEffect(() => {
    const loadProgramData = async () => {
      const filePath = path.join(CONFIG.dataPath, 'program.json');
      try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        setProgramData(parsedData);
      } catch (error) {
        console.error('Error loading program data:', error);
      }
    };
    loadProgramData();
  }, []);

  return (
    <Router>
      // ... Your accessible React Router setup ...
    </Router>
  );
};

// ... Your accessibility functions (merged both parties)

export default App;