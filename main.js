const columns = [
  { Header: 'src/constants.js' },
  // ... (additional columns up to 26 total)
  { Header: 'dist/main.js', accessor: 'distMain' },
];

const distMain = async () => {
  const mainModule = await import('./dist/main.js');
  return mainModule.default;
};

const tableData = await Promise.all(columns.map(column => 
  column.accessor ? distMain().then(main => main[column.accessor]) : null
));

// ... rest of the file content remains unchanged