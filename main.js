// Current main.js content with merged changes
// Integrating both sets of changes to create a single-file React-based bot with a fallback to regular Node.js code

// Ensure Node.js compatibility and require necessary modules
let React = null;
let { useState, useEffect } = null;

if (typeof window !== 'undefined' && window.React) {
    React = window.React;
    const { useState, useEffect } = React;
} else {
    // Load React and React hooks if it's not available in the browser environment (e.g., Node.js server)
    const React = require('react');
    const { useState, useEffect } = React;
}

// Import Screeps module
const creep = require('./screeps.js');

export default function App({ initialState }) {
    const [data, setData] = useState(initialState);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    // ... other state variables remain the same

    // Fetching functions to retrieve data from the Screeps API
    const fetchStats = async (bypassCache) => {
        // ... fetchStats function remains the same
    };

    useEffect(() => {
        if (initialState) return;
        fetchStats(false).then((data) => {
            // If data is available, update the component's state
            setData(data);
        });
    }, []);

    // ... other function remains the same

    // Adding a new function to handle the update of the component's state from the Screeps bot
    const updateData = ({ roomName, memory }) => {
        setData(memory);
    };

    // Update the component's state with the latest data from the Screeps bot
    creep.spawn.onNewCreep((creepName) => {
        creep.my[creepName].on(-1, updateData);
    });

    // ... return the JSX remained the same
}