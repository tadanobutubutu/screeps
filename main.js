We need to resolve conflict in main.js. The HEAD side is a React web app with accessibility functions; the other side is Screeps game loop and a Dashboard component. The conflict markers show that the HEAD content (the React code) is the one to keep, but we need to incorporate both changes logically. However the other side seems completely unrelated (Screeps). The HEAD includes imports, ReactDOM, App, and various functions. The other side includes module.exports for Screeps, and a Dashboard component.

We need to decide how to merge. The file 'main.js' originally likely belongs to the React app (the HEAD). The Screeps part seems out-of-place; maybe it's a different file that got merged incorrectly. The conflict markers show that the HEAD part is the entire React code, while the other part is the Screeps loop and Dashboard component. Since they are unrelated, we need to decide which to keep. The instruction: "Make sure to keep and integrate both changes if they both add features, or choose the correct logic that compiles and satisfies both needs." They are contradictory; we cannot have both a React app and Screeps loop in same file. The HEAD includes ReactDOM and App; the other includes module.exports loop for Screeps and Dashboard component. Probably the correct file is the React app's main.js, and the Screeps part is erroneous. So we should keep the HEAD content (the React code) and discard the Screeps part (module.exports and Dashboard?) But the Dashboard component may be part of the same app? However the HEAD already has App component imported; maybe Dashboard is a component used inside App. The HEAD does not show Dashboard usage. The other side includes Dashboard component but no import of ReactDOM etc. The HEAD imports React, ReactDOM, App, etc. The Dashboard component is likely part of the same app but not included in HEAD. Could we merge by adding the Dashboard component after the App render? Or maybe the HEAD file originally had only the ReactDOM rendering and functions; the other side added Screeps loop and Dashboard component (maybe for a different environment). Since they conflict, we need to resolve by picking one coherent file.

Given the HEAD includes all the accessibility functions and the React rendering, it's likely the intended main.js. The other side seems like a leftover from a different project (Screeps). So we should keep HEAD and discard the Screeps part. But we must ensure no syntax errors. The HEAD already has proper code; we just need to ensure that we don't have leftover conflict markers. The resolved file should be the HEAD content, but we need to ensure we have proper imports and no duplicate exports.

Check for any duplication: The HEAD includes `import React from 'react'; import ReactDOM from 'react-dom/client';` etc. Then later there is `import React, { useState } from 'react';` which is duplicate. In HEAD we already imported React, but not destructuring useState. However the Dashboard component uses useState, so we need to import useState. The HEAD currently does not import useState; but the Dashboard component is not part of HEAD. If we keep HEAD only, we may miss useState import needed for Dashboard if it's used elsewhere. However the HEAD code includes App component; maybe Dashboard is used inside App. Not sure.

The HEAD includes `import React from 'react';` which brings default export only, not useState. To use useState, we need `import React, { useState } from 'react';`. The HEAD currently does not have useState import, but the Dashboard component (from other side) uses it. Since we are merging, we should adjust import to include useState.

Also the HEAD includes `import './index.css'; import App from './App'; import reportWebVitals from './reportWebVitals';`. That's fine.

The HEAD also includes many functions; they are defined but not used except in DOMContentLoaded. That's fine.

Now we need to incorporate the Screeps part? Maybe the file is meant to be both a Screeps bot and a React UI? That seems impossible. However maybe the repository is a Screeps bot that also has a React admin UI, and main.js is the entry point for the UI, while the Screeps loop is separate. The conflict may be that the HEAD side (the UI) is being merged with the Screeps side (the bot). The proper resolution might be to keep both: the file could export both the UI rendering and the Screeps loop? But that wouldn't make sense.

Maybe the intention: The HEAD side is the correct main.js for the React UI, while the other side is a leftover from a different file that got merged erroneously. The instruction says "Do not discard functionality unless they are clearly redundant." The Screeps part is clearly not part of the UI; it's a separate module. So we should discard it.

Thus we will produce the HEAD content, but fix the import to include useState (since Dashboard uses it). However the HEAD doesn't have Dashboard usage; but maybe App uses Dashboard. Safer to add useState import.

Also ensure that the file ends with `reportWebVitals();` which is present.

Let's rewrite the file:

- Start with imports: import React, { useState } from 'react'; import ReactDOM from 'react-dom/client'; import './index.css'; import App from './App'; import reportWebVitals from './reportWebVitals';

- Then the ReactDOM render.

- Then define functions (addLangAttribute, fixTableStructure, addMainLandmark, fix [Hood] [pálido para óculos de sol] [Óculos escuros]