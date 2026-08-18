const React = require('react');

const MyTableComponent = () => {
  return React.createElement('table', { id: 'data-table' }, [
    React.createElement('thead', { key: 'head' }, [
      React.createElement('tr', { key: 'row' }, [
        React.createElement('th', { key: 'col1', scope: 'col' }, 'Column 1'),
        React.createElement('th', { key: 'col2', scope: 'col' }, 'Column 2'),
        React.createElement('th', { key: 'col3', scope: 'col' }, 'Column 3')
      ])
    ]),
    React.createElement('tbody', { key: 'body' })
  ]);
};

module.exports = MyTableComponent;