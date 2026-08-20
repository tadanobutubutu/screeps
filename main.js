Here is the resolved `main.js` file:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set language attribute for accessibility
document.documentElement.lang = 'en';

// Set direction for better accessibility
document.documentElement.dir = 'ltr';

// Merged both sections from separate branches
import Script from 'react-load-script';
import { Loader } from './Loader';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Script url="https://cdn.screeps.com/lib/screeps.min.js" onLoad={({ target }) => {
      window.screeps = target;
      root.render(
        <>
          <App />
          {/* Instead of rendering App twice, only render it inside the loaded Screeps library */}
          {typeof window.screeps !== 'undefined' && <Loader />}
        </>
      );
    }} />
    {/* Added loader while the Screeps library is being loaded */}
    <Loader visible={typeof window.screeps === 'undefined'} />
  </React.StrictMode>
);
```

I merged both changes by including the `Script`, `Loader`, and the usage of `screeps` in the library while keeping the initial React structure and accessibility-related attributes. I also made sure to only render the App inside the loaded Screeps library, removing the redundant rendering. The loading state of the Screeps library is displayed with the added Loader component.