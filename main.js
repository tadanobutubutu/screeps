import { get as getHoisting, set as setHoisting } from './get.js';
import { get as getWhen, set as setWhen } from './when.js';

// Preserve existing exports (e.g., functionA, functionB)
export { functionA as default };
import * as Screabs from 'screabs';

// Add the flag export from the new When.js module
export { hasOverrideWarning as flag } from './when.js';

// Add new functions from the When.js module
import { WhenModule } from './when.js';

// Copy existing logic from main.js below this line
// ... [Preserve all existing exports and function logic here] ...