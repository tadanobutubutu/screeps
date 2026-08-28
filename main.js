import React from 'react';

const MyComponent = () => {
  // Existing component code

  // Add ARIA property role for better tab focusability
  const role = 'button';
  const inputRole = 'checkbox';

  return (
    <div>
      {/* Existing component JSX */}

      {/* Add role attribute for better tab focusability */}
      <button role={role}>Button with ARIA role</button>

      {/* Add role='checkbox' attribute for checkboxes */}
      <input type="checkbox" role={inputRole} />
    </div>
  );
};

// Functions to render dependency graphs or index views
const renderDependencyGraph = (dependencies) => {
  if (!dependencies || typeof dependencies !== 'object') {
    return null;
  }

  return (
    <div className="dependency-graph">
      <h3>Dependency Graph</h3>
      <ul>
        {Object.keys(dependencies).map((dep) => (
          <li key={dep}>
            <strong>{dep}</strong>
            {dependencies[dep] && (
              <ul>
                {Object.keys(dependencies[dep]).map((subDep) => (
                  <li key={`${dep}.${subDep}`}>{subDep}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const renderIndexView = (items) => {
  if (!Array.isArray(items)) {
    return null;
  }

  return (
    <div className="index-view">
      <h3>Index</h3>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

// Export MyComponent
export default MyComponent;

export { renderDependencyGraph, renderIndexView };