import React from 'react';

const MyTableComponent = () => {
  return React.createElement('table', null,
    React.createElement('thead', null,
      React.createElement('tr', null,
        React.createElement('th', { scope: 'col' }, 'Column 1'),
        React.createElement('th', { scope: 'col' }, 'Column 2'),
        React.createElement('th', { scope: 'col' }, 'Column 3')
      )
    ),
    React.createElement('tbody', null)
  );
};

export default MyTableComponent;