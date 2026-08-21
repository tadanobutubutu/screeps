// Import the dependency graph Redux slice
import { dependencyGraphSlice } from './dependency-graph-slice';

// Import the index Redux slice
import { indexSlice } from './index-slice';

// Add all required slices to the existing rootReducer
const rootReducer = combineReducers({
  // Existing reducers remain untouched
  dependencyGraph: dependencyGraphSlice.reducer,
  index: indexSlice.reducer,
  // ...existing reducers (preserve original entries if any)
});

export default rootReducer;