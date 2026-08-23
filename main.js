/* eslint-disable import/no-medianames */
import FlightControlPanel from './FlightControlPanel';
import PilotInfoView from './PilotInfoView';

import { withAccessibleLabel } from './AccessibilityUtils';

// Universal function decorator to add accessibility labels
function makeAccessible(targetNames) {
  return targetNames.map((name) => {
    const wrapped = withAccessibleLabel(name);
    return wrapped;
  });
}

(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)
(these were removed)