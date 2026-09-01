import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';
import fs from 'fs';
import path from 'path';
import axe from 'axe-core';
import { greet, add, countDependencies, getDependencies, addDependency, removeDependency } from './dependencyFunctions';
import { CONFIG, config } from './config';
import { addLangAttribute } from './utilities';
import { ensureMainContainerAccessible } from './accessibility';
import { loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById } from './landmarks';
import { improveAccessibility } from './improveAccessibility';
import { fetchUser, clearCache } from './userFunctions';
import { addKeyboardNavigation, addAriaLabels, addScreenReaderAnnouncements, addFocusTrap } from './accessibilityFunctions';
import { functionA, functionB } from './objectExports';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App
      greet={greet}
      add={add}
      countDependencies={countDependencies}
      getDependencies={getDependencies}
      addDependency={addDependency}
      removeDependency={removeDependency}
      config={config}
      CONFIG={CONFIG}
      appState={{ initialized: false, data: null, cache: {}, lang: 'en' }}
      a11y={a11y}
      CHECK_LANG_ATTRIBUTE={() => addLangAttribute(document.documentElement)}
      FIX_TABLE_STRUCTURE={() => improveAccessibility('fixTableStructure')}
      CHECK_LINK_ACCESSIBILITY={a11y.checkLinkAccessibility}
      ENSURE_MAIN_CONTAINER_ACCESSIBLE={ensureMainContainerAccessible}
      LOAD_LANDMARKS={() => loadLandmarks()}
      PROCESS_LANDMARKS={processLandmarks}
      SORT_LANDMARKS={sortLandmarks}
      GET_LANDMARK_BY_ID={getLandmarkById}
      IMPROVE_ACCESSIBILITY={improveAccessibility}
      FETCH_USER={fetchUser}
      CLEAR_CACHE={clearCache}
      ADD_KEYBOARD_NAVIGATION={addKeyboardNavigation}
      ADD_ARIA_LABELS={addAriaLabels}
      ADD_SCREEN_READER_ANNOUNCEMENTS={addScreenReaderAnnouncements}
      ADD_FOCUS_TRAP={addFocusTrap}
      functionA={functionA}
      functionB={functionB}
    />
  </React.StrictMode>
);

// Uncommented implementation of addressAccessibilityIssues
function addressAccessibilityIssues() {
  // Address accessibility issues
}

// Exporting accessibility related functions
export { addressAccessibilityIssues };